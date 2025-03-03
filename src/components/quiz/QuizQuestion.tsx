
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/contexts/QuizContext";

export function QuizQuestion() {
  const {
    activeQuiz,
    currentQuestion,
    selectedOption,
    answered,
    score,
    generatedQuiz,
    availableQuizzes,
    questions,
    handleSelectOption,
    handleNextQuestion,
    handleExitQuiz
  } = useQuiz();

  const currentQ = activeQuiz === "generated" && generatedQuiz 
    ? generatedQuiz.questions[currentQuestion]
    : questions[currentQuestion];
    
  const currentQuestions = activeQuiz === "generated" && generatedQuiz 
    ? generatedQuiz.questions
    : questions;
    
  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
  
  const quizTitle = activeQuiz === "generated" && generatedQuiz 
    ? generatedQuiz.title
    : availableQuizzes.find(q => q.id === activeQuiz)?.title;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{quizTitle}</CardTitle>
              <CardDescription>Pergunta {currentQuestion + 1} de {currentQuestions.length}</CardDescription>
            </div>
            <Badge variant="outline">
              {score} / {currentQuestion + (answered ? 1 : 0)}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-lg font-medium">{currentQ.text}</div>
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`
                        p-4 rounded-lg border border-border transition-all duration-200
                        ${!answered ? 'cursor-pointer hover:border-primary hover:bg-primary/5' : ''}
                        ${isSelected ? 'border-primary/70 bg-primary/10' : ''}
                        ${showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                        ${showIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm border
                            ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground text-muted-foreground'}
                            ${showCorrect ? 'bg-green-500 text-white border-green-500' : ''}
                            ${showIncorrect ? 'bg-red-500 text-white border-red-500' : ''}
                          `}>
                            {option.id}
                          </div>
                          <span>{option.text}</span>
                        </div>
                        {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="font-medium mb-1">Explicação:</div>
                  <p className="text-muted-foreground">{currentQ.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handleExitQuiz}
          >
            Sair do Quiz
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={!answered}
            className="gap-2"
          >
            {currentQuestion < currentQuestions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultados'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
