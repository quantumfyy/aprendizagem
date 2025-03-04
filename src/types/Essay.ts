export interface EssayHistory {
  id: string;
  date: Date;
  topic: string;
  content: string;
  totalScore: number;
  competencies: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  suggestions: string[];
}