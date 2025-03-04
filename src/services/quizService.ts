import { supabase } from './supabase';

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  created_at: Date;
}

export const quizService = {
  async saveQuizResult(userId: string, result: Omit<QuizResult, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          quiz_title: result.quiz_title,
          score: result.score,
          total_questions: result.total_questions
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getQuizHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // Se houver erro de autenticação, deixe o QuizContext lidar com isso
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};