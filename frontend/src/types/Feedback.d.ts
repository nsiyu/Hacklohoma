type FeedbackScores = {
  software_engineer_code_feedback: {
    correctness_score: number;
    syntax_score: number;
    completeness_score: number;
    optimality_score: number;
  };
  software_engineer_future_plan_feedback: {
    key_strengths: string[];
    area_to_focus: string[];
    recommended_practice_topics: string[];
    improvement_feedback_plan: string[];
  };
  interview_feedback: string;
  behavioral_feedback: string;
}

interface InterviewFeedbackProps {
  feedback: FeedbackScores;
  interviewData: InterviewData;
}


export { FeedbackScores, InterviewFeedbackProps };