
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export function QuizGeneratingLoader() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center py-10 space-y-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-center">Gerando seu Quiz</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Nossa IA está criando um quiz personalizado sobre o tema escolhido.
              Isso pode levar alguns segundos...
            </p>
            <Progress value={65} className="w-full max-w-md h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
