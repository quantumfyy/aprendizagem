

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  difficulty: string;
  time: string;
}

export interface QuizItem {
  id: string;
  title: string;
  questions: number;
  difficulty: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface QuizFormData {
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questionsCount: number;
}
