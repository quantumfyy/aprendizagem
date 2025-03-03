
import { createClient } from '@supabase/supabase-js';

// Estas URLs seriam substituídas pelas reais quando conectado ao Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  questions_count: number;
  created_at: string;
  created_by: string;
}

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  text: string;
  options: {
    id: string;
    text: string;
    is_correct: boolean;
  }[];
  explanation: string;
  created_at: string;
}

export type UserProgress = {
  id: string;
  user_id: string;
  total_quizzes_completed: number;
  total_score: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

// Funções de acesso ao Supabase

// Usuários
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
};

export const updateUserProfile = async (updates: Partial<User>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };
  
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  return { data, error };
};

// Quizzes
export const getAvailableQuizzes = async () => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });
    
  return { data, error };
};

export const getQuizQuestions = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('id');
    
  return { data, error };
};

export const saveQuizAttempt = async (quizAttempt: Omit<QuizAttempt, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert(quizAttempt)
    .select()
    .single();
    
  return { data, error };
};

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};

export const updateUserProgress = async (updates: Partial<UserProgress>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };
  
  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();
    
  return { data, error };
};
