'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InterviewFeedback from '@/components/InterviewFeedback';
import Confetti from '@/components/Confetti';
import { ElevenLabsClient } from "elevenlabs";
import Link from 'next/link';

// Hardcoded feedback data for testing
const mockFeedback = {
  software_engineer_code_feedback: {
    correctness_score: 4,
    syntax_score: 5,
    completeness_score: 3,
    optimality_score: 4
  },
  software_engineer_future_plan_feedback: {
    key_strengths: [
      "Problem Understanding",
      "Code organization",
      "Communication skills",
      "Debugging approach"
    ],
    area_to_focus: [
      "Edge case handling",
      "Initial solution optimization",
      "Time complexity analysis",
      "Solution planning"
    ],
    recommended_practice_topics: [
      "Two Pointers",
      "Array Manipulation",
      "Space-Time Tradeoffs",
      "Edge Cases"
    ],
    improvement_feedback_plan: [
      "Take more time to plan before coding",
      "Practice more edge cases",
      "Work on optimizing initial solutions",
      "Be proactive in complexity discussions"
    ]
  },
  interview_feedback: `Your solution correctly handles the core requirements of the problem. The algorithm demonstrates a good understanding of array manipulation and the two-pointer technique. The edge cases are well-handled, particularly for empty arrays and single-element inputs.

The time complexity of O(n) is appropriate for this problem, and the space complexity of O(1) is optimal.`,
  behavioral_feedback: `Throughout the interview, you maintained clear communication and effectively explained your thought process. You asked clarifying questions before diving into the solution, which is a positive sign.

You handled hints well and remained composed when debugging the initial implementation. Your ability to think aloud while coding helped demonstrate your problem-solving approach.`
};

interface InterviewData {
  question: {
    title: string;
    description: string;
    difficulty: "easy";
    examples: {
      input: string;
      output: string;
      explanation: string;
    }[];
    constraints: string[];
  };
  code: string;
  transcript: {
    conversation_turn_metrics: string | null;
    feedback: string | null;
    message: string | null;
    role: string | null;
    time_in_call_secs: number | null;
    tool_calls: any[] | null;
    tool_results: any[] | null;
  }[];
}

const FeedbackPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const searchParams = useSearchParams();

  const getTranscript = async (conversationId: string) => {
    const finalClient = new ElevenLabsClient({ 
      apiKey: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY as string 
    });
    const response = await finalClient.conversationalAi.getConversation(conversationId);
    return response.transcript;
  }

  useEffect(() => {
    const fetchFeedback = async (data: InterviewData) => {
      try {
        const response = await fetch('http://localhost:8001/grade-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: data.code,
            question: {
              ...data.question,
            },
            transcripts: data.transcript.map(transcript => ({
              message: transcript.message,
              role: transcript.role,
              time_in_call_secs: 120
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const feedbackData = await response.json();
        console.log('Feedback data:', feedbackData);
        setFeedback(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setFeedback(mockFeedback);
      } finally {
        setIsLoading(false);
      }
    };

    try {
      const encodedData = searchParams.get('data');
      if (encodedData) {
        const decodedData = JSON.parse(decodeURIComponent(encodedData));
        console.log('Decoded data:', decodedData);
        const conversationId = decodedData.transcript;
        if (conversationId) {
          getTranscript(conversationId)
            .then(transcriptData => {
              decodedData.transcript = transcriptData;
              console.log('Decoded data:', decodedData);
              setInterviewData(decodedData);
              fetchFeedback(decodedData);
            })
            .catch(error => {
              console.error('Error fetching final transcript:', error);
              setInterviewData(decodedData);
              fetchFeedback(decodedData);
            });
          return;
        }
        setInterviewData(decodedData);
        fetchFeedback(decodedData);
      }
    } catch (error) {
      console.error('Error parsing interview data:', error);
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  if (!interviewData || !feedback) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No interview data found.</p>
          <a href="/catalog" className="text-emerald-600 hover:text-emerald-700 underline mt-4 inline-block">
            Return to Catalog
          </a>
        </div>
      </div>
    );
  }

  const totalScore = ((feedback.software_engineer_code_feedback.correctness_score + 
    feedback.software_engineer_code_feedback.syntax_score + 
    feedback.software_engineer_code_feedback.completeness_score + 
    feedback.software_engineer_code_feedback.optimality_score) / 20) * 100;

  return (
    <>
      {showConfetti && <Confetti />}
      <InterviewFeedback 
        feedback={feedback} 
        interviewData={interviewData}
      />
    </>
  );
};

export default FeedbackPage;