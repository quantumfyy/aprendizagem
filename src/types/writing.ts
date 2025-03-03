export interface WritingStats {
  id?: string;
  topic: string;
  content: string;
  supportMaterial?: string;
  feedback?: {
    score: number;
    competencies: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
    suggestions: string[];
  };
  created_at?: string;
  user_id?: string;
}

export interface WritingPromptProps {
  topic: string;
  supportMaterial: string;
  onGenerateNewTopic: () => void;
}

export interface WritingEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export interface WritingFeedbackProps {
  feedback: {
    score: number;
    comments: string[];
  };
}