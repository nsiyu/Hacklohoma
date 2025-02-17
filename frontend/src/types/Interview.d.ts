type InterviewQuestion = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string[];
};

type InterviewTranscriptMessage = {
  role: 'user' | 'assistant';
  content: string;
};

enum EngingeeringLevel {
  E1 = "E1", 
  E2 = "E2", 
  E3 = "E3", 
  E4 = "E4", 
  E5 = "E5", 
  IC0 = "IC0", 
  IC1 = "IC1", 
  IC2 = "IC2",
  IC3 = "IC3",
  IC4 = "IC4",
}

interface QuestionRequest {
  topic?: Topic;
  difficulty?: string;
  company?: string;
  engineering_level?: string; 
  custom_requiments?: string;   
  test_cases?: boolean;
}

interface InterviewData {
  question: {
    title: string;
    description: string;
    difficulty: string;
    examples: {
      input: string;
      output: string;
      explanation: string;
    }[];
    constraints: string[];
  };
  transcript: {
    time_in_call_secs: number | null;
  }[];
}
export {Topic, Difficulty, QuestionRequest, InterviewQuestion, InterviewTranscriptMessage, InterviewData };