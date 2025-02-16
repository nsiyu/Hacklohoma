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

enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

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

// export const levelToDifficulty: Record <EngingeeringLevel, Difficulty> = {
//   [EngingeeringLevel.E1]: Difficulty.Easy,
//   [EngingeeringLevel.E2]: Difficulty.Medium,
//   [EngingeeringLevel.E3]: Difficulty.Medium,
//   [EngingeeringLevel.E4]: Difficulty.Hard,
//   [EngingeeringLevel.E5]: Difficulty.Hard,
//   [EngingeeringLevel.IC0]: Difficulty.Easy,
//   [EngingeeringLevel.IC1]: Difficulty.Medium,
//   [EngingeeringLevel.IC2]: Difficulty.Medium,
//   [EngingeeringLevel.IC3]: Difficulty.Medium,
//   [EngingeeringLevel.IC4]: Difficulty.Hard,
// }


interface QuestionRequest {
  topic?: Topic;
  difficulty?: Difficulty;
  company?: string;
  engineering_level?: string; 
  custom_requiments?: string;   
  test_cases?: boolean;
}

export {Topic, Difficulty, QuestionRequest, InterviewQuestion, InterviewTranscriptMessage };

