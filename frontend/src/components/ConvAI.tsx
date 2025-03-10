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
  const [conversation, setConversation] = useState<any>(null);
  const [knowledgeBaseId, setKnowledgeBaseId] = useState<string | null>(null);
  const isConnectedRef = useRef(false);
  const conversationRef = useRef<any>(null);
  const [isEnding, setIsEnding] = useState(false);
  const isEndingRef = useRef(false);

  const client = new ElevenLabsClient({ 
    apiKey: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY as string 
  });

  const debouncedUpdateKnowledgeBase = useCallback(
    debounce(async (code: string) => {
      if (!code.trim()) return;

      try {
        let questionResponse = null;
        if (question) {
          console.log('Adding question to knowledge base...');
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

          const questionFile = new File(
            [questionContent],
            'interview_question.txt',
            { type: 'text/plain' }
          );

          questionResponse = await client.conversationalAi.addToKnowledgeBase({
            file: questionFile
          });

          if (!questionResponse || !questionResponse.id) {
            console.error('Invalid response from knowledge base for question');
            return;
          }
          console.log('Question added to knowledge base with ID:', questionResponse.id);
        }

        if (knowledgeBaseId) {
          console.log('Cleaning up old knowledge base:', knowledgeBaseId);
          await removeFromKnowledgeBase();
        }
        
        console.log('Fetching updated knowledge base content...');
      } catch (error) {
        console.error('Error updating knowledge base:', error);
      }
    }, 10000),
    [question, knowledgeBaseId]
  );

  useEffect(() => {
    debouncedUpdateKnowledgeBase(currentCode);
  }, [currentCode, debouncedUpdateKnowledgeBase]);

  async function addToKnowledgeBase() {
    if (!question) return false;

    try {
      const textContent = [
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

      if (textContent.length > 100000) {
        console.error('Content too large for knowledge base');
        return false;
      }

      const file = new File(
        [textContent], 
        'question.txt', 
        { type: 'text/plain' }
      );

      try {
        const response = await client.conversationalAi.addToKnowledgeBase({
          file
        });

        if (!response || !response.id) {
          console.error('Invalid response from knowledge base');
          return false;
        }

        setKnowledgeBaseId(response.id);

        const updateAgentPayload = {
          conversation_config: {
            agent: {
              prompt: {
                knowledge_base: [{
                  type: 'file' as const,
                  name: 'interview_question',
                  id: response.id
                }]
              }
            }
          }
        };

        await client.conversationalAi.updateAgent(
          process.env.NEXT_PUBLIC_AGENT_ID as string,
          updateAgentPayload
        );

        return true;
      } catch (apiError) {
        console.error('ElevenLabs API error:', apiError);
        if (knowledgeBaseId) {
          await removeFromKnowledgeBase();
        }
        return false;
      }
    } catch (error) {
      console.error('Error preparing knowledge base content:', error);
      return false;
    }
  }

  async function removeFromKnowledgeBase() {
    if (!knowledgeBaseId) return;

    try {
      console.log('Removing from knowledge base:', knowledgeBaseId);
      // await client.conversationalAi.deleteKnowledgeBaseDocument(knowledgeBaseId);
      setKnowledgeBaseId(null);
    } catch (error) {
      console.error('Error removing from knowledge base:', error);
    }
  }

  const startConversation = async () => {
    setIsLoading(true);
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setIsLoading(false);
      alert("No permission");
      return;
    }

    const knowledgeBaseAdded = await addToKnowledgeBase();
    if (!knowledgeBaseAdded) {
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
          if (!isEndingRef.current) {
            await endConversation();
            return;
          }
          setIsConnected(false);
          setIsSpeaking(false);
          
          // Get the data ready for redirection
          const conversationId = conversationRef.current?.getId();
          if (conversationId) {
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
            window.location.href = `/feedback?data=${encodedData}`;
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
      await removeFromKnowledgeBase();
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

    setIsEnding(true);
    isEndingRef.current = true;

    try {
      const conversationId = currentConversation.getId();
      console.log('Ending conversation ID:', conversationId);

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

      console.log('Prepared interview data:', interviewData);
      const encodedData = encodeURIComponent(JSON.stringify(interviewData));

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

      await removeFromKnowledgeBase();
      
      // End the session
      console.log('Ending session...');
      await currentConversation.endSession();
      setConversationAndRef(null);

      // Redirect immediately after ending the session
      console.log('Redirecting to feedback page...');
      window.location.href = `/feedback?data=${encodedData}`;
    } catch (error) {
      console.error('Error in end conversation process:', error);
      isEndingRef.current = false;
      setIsEnding(false);
    }
  }

  const setConversationAndRef = (newConversation: any) => {
    setConversation(newConversation);
    conversationRef.current = newConversation;
  };

  return (
    <>
      {!isConnected && !isLoading && question && (
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