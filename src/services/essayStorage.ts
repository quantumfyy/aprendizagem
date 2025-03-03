import { supabase } from './supabase';

type Observer = () => void;

interface Essay {
  id: string
  user_id: string
  topic: string
  content: string
  score: number
  created_at: string
  competencies: Array<{
    name: string
    score: number
    feedback: string
  }>
  suggestions: string[]
}

class EssayStorageService {
  private observers: Set<Observer> = new Set();

  subscribe(observer: Observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  private notify() {
    this.observers.forEach(observer => observer());
  }

  async saveEssay(essay: Omit<Essay, 'id' | 'created_at' | 'user_id'>) {
    const { data, error } = await supabase
      .from('essays')
      .insert({
        ...essay,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    this.notify();
    return data;
  }

  async getAllEssays(): Promise<Essay[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('essays')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getEssayStats() {
    const essays = await this.getAllEssays();
    
    if (essays.length === 0) {
      return {
        totalEssays: 0,
        averageScore: 0,
        bestScore: 0,
        essaysThisMonth: 0,
        improvementRate: 0,
        history: [],
        competencies: []
      };
    }

    const thisMonth = new Date()
    thisMonth.setDate(1)

    return {
      totalEssays: essays.length,
      averageScore: Math.round(
        essays.reduce((acc, essay) => acc + essay.score, 0) / essays.length
      ),
      bestScore: Math.max(...essays.map(essay => essay.score)),
      essaysThisMonth: essays.filter(
        essay => new Date(essay.created_at) >= thisMonth
      ).length,
      improvementRate: essays.length >= 2
        ? Math.round(
            ((essays[0].score - essays[essays.length - 1].score) / essays[essays.length - 1].score) * 100
          )
        : 0,
      history: essays.map(essay => ({
        date: new Date(essay.created_at).toLocaleDateString(),
        score: essay.score
      })),
      competencies: essays[0]?.competencies || []
    }
  }
}

export const essayStorage = new EssayStorageService();