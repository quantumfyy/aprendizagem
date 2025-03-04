import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WritingHistory } from '@/components/writing/WritingHistory'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { userService } from '@/services/userService'
import { QuizProgress } from '@/components/quiz/QuizProgress'

export default function ProgressPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  if (!user) return null

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Seu Progresso</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="writings">Redações</TabsTrigger>
          <TabsTrigger value="exercises">Exercícios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* ... */}
        </TabsContent>

        <TabsContent value="writings" className="space-y-4">
          <WritingHistory />
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <QuizProgress />
        </TabsContent>
      </Tabs>
    </div>
  );
}
