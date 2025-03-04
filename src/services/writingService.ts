import { supabase } from './supabase';

export interface WritingResult {
  id: string;
  user_id: string;
  title: string;
  content: string;
  score: number;
  feedback: string;
  created_at: Date;
  support_material?: string;
}

export const writingService = {
  async saveWriting(userId: string, writing: Omit<WritingResult, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('writings')
        .insert({
          user_id: userId,
          ...writing
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getWritingHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('writings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
};