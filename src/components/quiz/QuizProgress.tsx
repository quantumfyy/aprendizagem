import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuiz } from "@/contexts/QuizContext";
import { Circle, TrendingUp, Target, Brain } from "lucide-react";

export function QuizProgress() {
  const { quizHistory, isLoading, refreshHistory } = useQuiz();

  useEffect(() => {
    refreshHistory();
  }, []);

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  const totalQuizzes = quizHistory.length;
  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc, quiz) => 
        acc + (quiz.score / quiz.total_questions) * 100, 0) / totalQuizzes)
    : 0;
  const bestScore = Math.max(...quizHistory.map(quiz => 
    Math.round((quiz.score / quiz.total_questions) * 100)
  ), 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Quizzes</p>
                <p className="text-2xl font-bold">{totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Média de Acertos</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Melhor Pontuação</p>
                <p className="text-2xl font-bold">{bestScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {quizHistory.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Nenhum quiz realizado ainda
                </p>
              ) : (
                quizHistory.map((quiz) => (
                  <div 
                    key={quiz.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Circle 
                        className={`h-3 w-3 ${getScoreColor(quiz.score / quiz.total_questions * 100)}`}
                        fill="currentColor"
                      />
                      <div>
                        <h4 className="font-medium">{quiz.quiz_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(quiz.score / quiz.total_questions * 100)}`}>
                        {Math.round((quiz.score / quiz.total_questions) * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quiz.score} de {quiz.total_questions}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}