import { EssayHistory } from '../types/Essay';

export class EssayHistoryService {
  private static STORAGE_KEY = 'essay_history';

  static saveEssay(essay: Omit<EssayHistory, 'id' | 'date'>): void {
    try {
      const history = this.getHistory();
      const newEssay: EssayHistory = {
        ...essay,
        id: crypto.randomUUID(),
        date: new Date()
      };
      
      history.push(newEssay);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      throw new Error('Falha ao salvar histórico da redação');
    }
  }

  static getHistory(): EssayHistory[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Erro ao recuperar histórico:', error);
      return [];
    }
  }

  static getEssayById(id: string): EssayHistory | null {
    const history = this.getHistory();
    return history.find(essay => essay.id === id) || null;
  }

  static deleteEssay(id: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter(essay => essay.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
  }
}