
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { QuizList } from "../components/quiz/QuizList";
import { QuizCreationForm } from "../components/quiz/QuizCreationForm";
import { GeneratedQuizCard } from "../components/quiz/GeneratedQuizCard";
import { QuizGeneratingLoader } from "../components/quiz/QuizGeneratingLoader";
import { QuizQuestion } from "../components/quiz/QuizQuestion";
import { QuizResults } from "../components/quiz/QuizResults";

function QuizContent() {
  const { 
    activeQuiz,
    showResults,
    isGeneratingQuiz,
    generatedQuiz
  } = useQuiz();

  // Render different components based on quiz state
  if (isGeneratingQuiz) {
    return <QuizGeneratingLoader />;
  }

  if (showResults) {
    return <QuizResults />;
  }

  if (activeQuiz) {
    return <QuizQuestion />;
  }

  // Return quiz listing and creation view
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="available">Quizzes Disponíveis</TabsTrigger>
          <TabsTrigger value="create">Criar Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          <QuizList />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <QuizCreationForm />
        </TabsContent>
      </Tabs>
      
      {generatedQuiz && <GeneratedQuizCard />}
    </div>
  );
}

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}
