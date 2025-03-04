import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuiz } from "@/contexts/QuizContext";

export function QuizHistory() {
  const { quizHistory } = useQuiz();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Histórico de Quizzes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {quizHistory.map((history, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{history.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(history.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((history.score / history.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {history.score} de {history.totalQuestions} questões
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}