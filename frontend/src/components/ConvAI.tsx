'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { InterviewQuestion, InterviewTranscriptMessage } from '@/types/Interview';
import { Conversation } from '@11labs/client';
import { ElevenLabsClient } from "elevenlabs";
import debounce from 'lodash/debounce';

interface ConvAIProps {
  question: InterviewQuestion | null;
  currentCode: string;
  onConversationStart: (id: string) => void;
  onTranscriptUpdate: (message: any) => void;
}


const ConvAI = ({ question, currentCode, onConversationStart, onTranscriptUpdate }: ConvAIProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [conversation, setConversation] = useState<any>(null);
  const [questionKbId, setQuestionKbId] = useState<string | null>(null);
  const [codeKbId, setCodeKbId] = useState<string | null>(null);

  const isConnectedRef = useRef(false);
  const conversationRef = useRef<any>(null);
  const isEndingRef = useRef(false);

  const client = new ElevenLabsClient({ 
    apiKey: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY as string 
  });

  const addContentToKnowledgeBaseAsText = async (content: string, filename: string) => {
    try {
      console.log(`Adding ${filename}.txt to knowledge base...`);

      if (content.length > 100000) {
        console.error('Content too large for knowledge base');
        return;
      }

      const kb_file = new File(
        [content],
        `${filename}.txt`,
        { type: 'text/plain' }
      );

      let response = await client.conversationalAi.addToKnowledgeBase({
        file: kb_file
      }); 

      if (!response || !response.id) {
        console.error(`Invalid response from knowledge base for adding ${filename}.txt`);
        return;
      } 
      console.log(`${filename}.txt added to knowledge base with ID: ${response.id}`)
      return response.id; 
    } catch (error) {
      console.error(`Error adding ${filename} to knowledge base:`, error);
      return null;
    }
  }

  const debouncedUpdateKnowledgeBase = useCallback(
    debounce(async (code: string) => {
      if (!code.trim()) return;
      console.log('Updating knowledge base content with new code...');
      try {

        const new_code_kb_id = await addContentToKnowledgeBaseAsText(code, "code");
          if (new_code_kb_id) {
            if (codeKbId){
              await removeFromKnowledgeBase("code");
            }   
            setCodeKbId(new_code_kb_id)
            await updateAgentWithKnowledgeBaseInfo();
          }
     
      } catch (error) {
        console.error('Error updating knowledge base:', error);
      }
    }, 3000),
    [codeKbId]
  );

  const redirectToFeedback = (conversationId: string) => {
    const interviewData = {
      question: {
        title: question?.title,
        description: question?.description,
        difficulty: question?.difficulty,
        examples: question?.examples,
        constraints: question?.constraints
      },
      code: currentCode,
      transcript: conversationId
    };
    
    console.log('Redirecting with interview data:', interviewData);
    const encodedData = encodeURIComponent(JSON.stringify(interviewData));
    //window.location.href = `/feedback?data=${encodedData}`;
  };

  const updateAgentWithKnowledgeBaseInfo = async (name: string, kb_id: string) => {
    const updateAgentPayload = {
      conversation_config: {
        agent: {
          prompt: {
            knowledge_base: [{
              type: 'file' as const,
              name: name,
              id: kb_id
            }]
          }
        }
      }
    };
  
    const response = await client.conversationalAi.updateAgent(
      process.env.NEXT_PUBLIC_AGENT_ID as string,
      updateAgentPayload
    );

    if (response) {
      console.log("Updated the agent", response)
    }
  };

  async function addQuestionToKnowledgeBase() {
    if (!question) return false;

    try {
      const questionContent = [
        `Title: ${question.title}`,
        `Description: ${question.description}`,
        'Examples:',
        ...question.examples.map((example, index) => 
          `Example ${index + 1}:\n` +
          `Input: ${example.input}\n` +
          `Output: ${example.output}\n` +
          `Explanation: ${example.explanation}`
        ),
        'Constraints:',
        ...question.constraints.map(constraint => `- ${constraint}`)
      ].join('\n\n');

      const question_kb_id = await addContentToKnowledgeBaseAsText(questionContent, "question");
      if (!question_kb_id) {
        return false; 
      }

      setQuestionKbId(question_kb_id);
      try {
        
        // const updateAgentPayload = {
        //   conversation_config: {
        //     agent: {
        //       prompt: {
        //         knowledge_base: [{
        //           type: 'file' as const,
        //           name: 'interview_question',
        //           id: question_kb_id
        //         }]
        //       }
        //     }
        //   }
        // };

        // const response = await client.conversationalAi.updateAgent(
        //   process.env.NEXT_PUBLIC_AGENT_ID as string,
        //   updateAgentPayload
        // );

        await updateAgentWithKnowledgeBaseInfo("question", question_kb_id);
        await addContentToKnowledgeBaseAsText("whyyyyy", "testtfile");
        return true;
      } catch (apiError) {
        console.error('ElevenLabs API error:', apiError);
        return false;
      }
    } catch (error) {
      console.error('Error preparing knowledge base content:', error);
      return false;
    }
  }

  async function removeFromKnowledgeBase(kb_type: "question" | "code") {
    const kbId = kb_type === "question" ? questionKbId : codeKbId;
  
    if (!kbId) return;
  
    try {
      console.log("Removing from knowledge base:", kb_type);
      await client.conversationalAi.deleteKnowledgeBaseDocument(kbId);
  
      if (kb_type === "question") {
        setQuestionKbId(null);
      } else {
        setCodeKbId(null);
      }
    } catch (error) {
      console.error("Error removing from knowledge base:", error);
    }
  }

  useEffect(() => {
    debouncedUpdateKnowledgeBase(currentCode);
  }, [currentCode, debouncedUpdateKnowledgeBase]);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (questionKbId) removeFromKnowledgeBase("question");
      if (codeKbId) removeFromKnowledgeBase("code");
    };
  }, []);
  
  const startConversation = async () => {
    setIsLoading(true);
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setIsLoading(false);
      alert("No permission");
      return;
    }

    const questionKnowledgeBaseAdded = await addQuestionToKnowledgeBase();
    if (!questionKnowledgeBaseAdded) {
      setIsLoading(false);
      alert("Failed to prepare interview knowledge");
      return;
    }

    try {
      const newConversation = await Conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID as string,
        onConnect: () => {
          console.log('Connected to conversation');
          isConnectedRef.current = true;
          setIsConnected(true);
          setIsSpeaking(true);
        },
        onDisconnect: async () => {
          console.log('Disconnecting conversation');
          
          // If conversation isn't already ending, trigger endConversation
          if (!isEndingRef.current) {
            await endConversation();
          }
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          alert('An error occurred during the conversation');
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === 'speaking');
        }
      });
      
      const conversationId = newConversation.getId();
      console.log('Conversation started with ID:', conversationId);
      setConversationAndRef(newConversation);
      onConversationStart(conversationId);

    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation');
      await removeFromKnowledgeBase("question");
      await removeFromKnowledgeBase("code");
    } finally {
      setIsLoading(false);
    }
  }

  async function requestMicrophonePermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      console.error('Microphone permission denied');
      return false;
    }
  }

  async function endConversation() {
    console.log('Starting end conversation process');
    
    const currentConversation = conversationRef.current;
    if (!currentConversation) {
      console.log('No conversation found');
      return;
    }
  
    // Set the ending flags to prevent duplicate cleanup
    if (isEndingRef.current) {
      console.log('Conversation already ending');
      return;
    }
  
    setIsRedirecting(true);
    isEndingRef.current = true;
  
    try {
      const conversationId = currentConversation.getId();
  
      // Clean up knowledge base
      try {
        await client.conversationalAi.updateAgent(
          process.env.NEXT_PUBLIC_AGENT_ID as string,
          {
            conversation_config: {
              agent: {
                prompt: {
                  knowledge_base: []
                }
              }
            }
          }
        );
      } catch (error) {
        console.error('Error updating agent:', error);
      }
  
      await removeFromKnowledgeBase("question");
      await removeFromKnowledgeBase("code");
      
      // Update UI state
      setIsConnected(false);
      setIsSpeaking(false);
      setConversationAndRef(null);
  
      // End the session
      console.log('Ending session...');
      await currentConversation.endSession();
  
      // Redirect to feedback
      redirectToFeedback(conversationId);
    } catch (error) {
      console.error('Error in end conversation process:', error);
      // Reset the ending flags and UI state if there was an error
      isEndingRef.current = false;
      setIsConnected(false);
      setIsSpeaking(false);
      setIsRedirecting(false);
    }
  }
  

  const setConversationAndRef = (newConversation: any) => {
    setConversation(newConversation);
    conversationRef.current = newConversation;
  };

  return (
    <>
      {!isConnected && !isLoading && !isRedirecting && question && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Start your interview
              </h3>
              <p className="mt-2 text-gray-600">
                Click the button below to begin your technical interview
              </p>
            </div>

            <button
              onClick={startConversation}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Start Interview'
              )}
            </button>
          </div>
        </div>
      )}
      
      {isConnected && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={endConversation}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            End Interview
          </button>
        </div>
      )}
    </>
  );
};

export default ConvAI;