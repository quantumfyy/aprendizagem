import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useQuiz } from "@/contexts/QuizContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizHistory } from './QuizHistory';

export function QuizResults() {
  const [showHistory, setShowHistory] = useState(false);
  const { addQuizResult } = useQuiz();
  const {
    score,
    activeQuiz,
    generatedQuiz,
    availableQuizzes,
    questions,
    handleRestartQuiz,
    handleExitQuiz
  } = useQuiz();

  const currentQuestions = activeQuiz === "generated" && generatedQuiz 
    ? generatedQuiz.questions
    : questions;
    
  const quizTitle = activeQuiz === "generated" && generatedQuiz 
    ? generatedQuiz.title
    : availableQuizzes.find(q => q.id === activeQuiz)?.title;

  // Salvar resultado quando o componente montar
  useEffect(() => {
    addQuizResult({
      quiz_title: quizTitle,
      score: score,
      total_questions: currentQuestions.length
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl">Resultados do Quiz</CardTitle>
          <CardDescription>
            {quizTitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="relative w-40 h-40">
              <motion.svg 
                className="w-full h-full" 
                viewBox="0 0 100 100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <circle
                  className="text-muted-foreground/20 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  initial={{ 
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40}` 
                  }}
                  animate={{ 
                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - score / currentQuestions.length)}`
                  }}
                  style={{
                    transformOrigin: "center",
                    transform: "rotate(-90deg)",
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-4xl font-bold fill-foreground"
                >
                  {Math.round((score / currentQuestions.length) * 100)}%
                </text>
                <text
                  x="50"
                  y="65"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-muted-foreground"
                >
                  {score} de {currentQuestions.length}
                </text>
              </motion.svg>
            </div>

            <div className="text-center space-y-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-xl font-semibold">
                  {score === currentQuestions.length ? "Perfeito!" : 
                    score > currentQuestions.length / 2 ? "Bom trabalho!" : "Continue praticando!"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {score === currentQuestions.length 
                    ? "Você dominou este tópico! Pronto para o próximo desafio?" 
                    : score > currentQuestions.length / 2 
                      ? "Você está indo bem, mas ainda há espaço para melhorar." 
                      : "Não se preocupe, aprender leva tempo. Tente novamente para melhorar sua pontuação."}
                </p>
              </motion.div>
            </div>

            <motion.div 
              className="flex space-x-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Button onClick={handleRestartQuiz} variant="outline" className="space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Refazer Quiz</span>
              </Button>
              <Button onClick={handleExitQuiz}>
                <span>Voltar aos Quizzes</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
          </Button>
        </CardFooter>
      </Card>

      {showHistory && <QuizHistory />}
    </div>
  );
}
