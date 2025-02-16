'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InterviewFeedback from '@/components/InterviewFeedback';
import Confetti from '@/components/Confetti';

// Hardcoded feedback data for testing
const mockFeedback = {
  correctness_score: 4,
  syntax_score: 5,
  completeness_score: 3,
  optimality_score: 4,
  total_score: 16, // New field for total score
  percentile: 85, // New field for percentile ranking
  interview_duration: "45 minutes", // New field for interview duration
  question_difficulty: "Medium", // New field for question difficulty
  interview_feedback: `Your solution correctly handles the core requirements of the problem. The algorithm demonstrates a good understanding of array manipulation and the two-pointer technique. The edge cases are well-handled, particularly for empty arrays and single-element inputs.

The time complexity of O(n) is appropriate for this problem, and the space complexity of O(1) is optimal.`,

  behavioral_feedback: `Throughout the interview, you maintained clear communication and effectively explained your thought process. You asked clarifying questions before diving into the solution, which is a positive sign.

You handled hints well and remained composed when debugging the initial implementation. Your ability to think aloud while coding helped demonstrate your problem-solving approach.`,

  improvement_feedback: `Consider the following areas for improvement:

1. Take more time to plan before coding - writing down the approach could help organize thoughts better
2. Practice more edge cases, especially for input validation
3. Work on optimizing the initial solution before being prompted
4. Could be more proactive in discussing time/space complexity tradeoffs`,

  key_strengths: [ // New field for key strengths
    "Problem understanding",
    "Code organization",
    "Communication skills",
    "Debugging approach"
  ],

  areas_to_focus: [ // New field for focus areas
    "Edge case handling",
    "Initial solution optimization",
    "Time complexity analysis",
    "Solution planning"
  ],

  recommended_topics: [ // New field for recommended practice
    "Two Pointers",
    "Array Manipulation",
    "Space-Time Tradeoffs",
    "Edge Cases"
  ]
};

const FeedbackPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Show confetti for 5 seconds when the feedback loads
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
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

  return (
    <>
      {showConfetti && <Confetti />}
      <InterviewFeedback feedback={mockFeedback} />
    </>
  );
};

export default FeedbackPage;