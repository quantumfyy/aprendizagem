
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { useQuiz } from "@/contexts/QuizContext";

export function GeneratedQuizCard() {
  const { generatedQuiz, handleStartQuiz } = useQuiz();

  if (!generatedQuiz) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="glass-panel card-hover overflow-hidden border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{generatedQuiz.title}</CardTitle>
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Quiz personalizado gerado pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> {generatedQuiz.questions.length} perguntas
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" /> {generatedQuiz.time}
              </span>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {generatedQuiz.difficulty}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button 
            onClick={() => handleStartQuiz("generated")} 
            className="w-full"
          >
            Iniciar Quiz
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
