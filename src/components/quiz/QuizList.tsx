
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";

export function QuizList() {
  const { availableQuizzes, handleStartQuiz } = useQuiz();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {availableQuizzes.map((quiz) => (
        <Card key={quiz.id} className="glass-panel card-hover overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>{quiz.title}</CardTitle>
              <quiz.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>Teste seu conhecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {quiz.questions} perguntas
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {quiz.time}
                </span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {quiz.difficulty}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={() => handleStartQuiz(quiz.id)} 
              className="w-full"
            >
              Iniciar Quiz
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
