import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/hooks/useAuth';
import { writingService, WritingResult } from '@/services/writingService';
import { FileText, TrendingUp, Star } from 'lucide-react';

export function WritingHistory() {
  const { user } = useAuth();
  const [writings, setWritings] = useState<WritingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      try {
        setIsLoading(true);
        const history = await writingService.getWritingHistory(user.id);
        setWritings(history);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [user]);

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  const averageScore = writings.length > 0
    ? Math.round(writings.reduce((acc, w) => acc + (w.score || 0), 0) / writings.length)
    : 0;

  const bestScore = Math.max(...writings.map(w => w.score || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Redações</p>
                <p className="text-2xl font-bold">{writings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Média das Notas</p>
                <p className="text-2xl font-bold">{averageScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Melhor Nota</p>
                <p className="text-2xl font-bold">{bestScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Redações</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {writings.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Nenhuma redação encontrada
                </p>
              ) : (
                writings.map((writing) => (
                  <Card key={writing.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{writing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Tema: {writing.topic}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(writing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          Nota: {writing.score}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-medium">Feedback:</h4>
                      <p className="text-sm text-muted-foreground">
                        {writing.feedback}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}