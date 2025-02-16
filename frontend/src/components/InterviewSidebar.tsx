'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { InterviewQuestion, InterviewTranscriptMessage } from '@/types/Interview';
import { QuestionRequest } from '@/types/Interview';
import { ElevenLabsClient } from 'elevenlabs';
enum Topic {
  Array = "Array",
  String = "String",
  BinarySearch = "Binary Search",
  Sorting = "Sorting",
  Greedy = "Greedy",
  DynamicProgramming = "Dynamic Programming",
}
const fetchQuestion = async (params: QuestionRequest) => {
  try {
    const response = await fetch('http://localhost:8000/create-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to fetch question: ${data.detail || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};

const transformTranscript = (apiTranscript: any[]): InterviewTranscriptMessage[] => {
  return apiTranscript
    .filter(msg => msg.message && typeof msg.message === 'string' && msg.role !== null)
    .map(msg => ({
      role: msg.role === 'agent' ? 'assistant' : 'user',
      content: msg.message
    }));
};

interface SidebarProps {
  onQuestionLoaded: (question: InterviewQuestion) => void;
  questionParams: {
    topic: Topic;
    company: string;
  };
  conversationId?: string;
}

const InterviewSidebar = ({ onQuestionLoaded, questionParams, conversationId }: SidebarProps) => {
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);

  const loadQuestion = useMemo(() => {
    if (question) return;
    
    return async () => {
      if (fetchInProgress.current) return;
      fetchInProgress.current = true;

      try {
        const fetchedQuestion = await fetchQuestion(questionParams);
        
        if (fetchedQuestion && fetchedQuestion.id) {
          setQuestion(fetchedQuestion);
          onQuestionLoaded(fetchedQuestion);
        } else {
          setError('Received invalid question format from server');
        }
      } catch (err) {
        console.error('Load question error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load question');
      } finally {
        fetchInProgress.current = false;
      }
    };
  }, [question, onQuestionLoaded]);

  useEffect(() => {
    if (loadQuestion) {
      loadQuestion();
    }
  }, [loadQuestion]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-center px-4">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-emerald-600 hover:text-emerald-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h2>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {question.description}
          </p>
          
          <div className="mt-6 space-y-4">
            {question.examples.map((example, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">Example {index + 1}:</p>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap break-all">
                  <div className="mb-1">
                    <span className="text-gray-600 mr-2">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-gray-600 mr-2">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 mr-2">Explanation:</span>
                    <span className="break-words">{example.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {question.constraints.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">Constraints:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {question.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSidebar;