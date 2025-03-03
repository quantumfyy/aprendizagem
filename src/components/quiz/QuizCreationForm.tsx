
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuiz } from "@/contexts/QuizContext";

// Schema for the quiz generation form
const quizFormSchema = z.object({
  topic: z.string().min(3, {
    message: "O tema deve ter pelo menos 3 caracteres",
  }),
  difficulty: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Por favor selecione uma dificuldade",
  }),
  questionsCount: z.coerce.number().min(3).max(15),
});

export function QuizCreationForm() {
  const { isGeneratingQuiz, onSubmitQuizForm } = useQuiz();
  
  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: "",
      difficulty: "intermediate",
      questionsCount: 5,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Novo Quiz</CardTitle>
        <CardDescription>
          Escolha um tema e nossa IA gerará um quiz personalizado para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitQuizForm)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema do Quiz</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: JavaScript, React, Python, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Dificuldade</FormLabel>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={field.value === "beginner" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => form.setValue("difficulty", "beginner")}
                    >
                      Iniciante
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "intermediate" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => form.setValue("difficulty", "intermediate")}
                    >
                      Intermediário
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "advanced" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => form.setValue("difficulty", "advanced")}
                    >
                      Avançado
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="questionsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Perguntas</FormLabel>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>3</span>
                      <span>{field.value}</span>
                      <span>15</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      className="w-full"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isGeneratingQuiz}>
              {isGeneratingQuiz ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Quiz...
                </>
              ) : (
                <>Gerar Quiz</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
