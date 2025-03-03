import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { generateEssayTopic, evaluateEssay } from '@/services/openai'
import { userService } from '@/services/userService'
import { WritingEditor } from './WritingEditor'
import { WritingPrompt } from './WritingPrompt'
import { WritingFeedback } from './WritingFeedback'
import { WritingHistory } from './WritingHistory' // Adiciona esta importação
import { toast } from 'sonner'
import { WritingStats } from '@/types/writing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function WritingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(() => sessionStorage.getItem('writingTopic') || '')
  const [content, setContent] = useState(() => sessionStorage.getItem('writingContent') || '')
  const [supportMaterial, setSupportMaterial] = useState(() => sessionStorage.getItem('writingSupportMaterial') || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState(() => {
    const saved = sessionStorage.getItem('writingEvaluation')
    return saved ? JSON.parse(saved) : null
  })

  // Persiste o estado na sessão
  useEffect(() => {
    if (topic) sessionStorage.setItem('writingTopic', topic)
    if (content) sessionStorage.setItem('writingContent', content)
    if (supportMaterial) sessionStorage.setItem('writingSupportMaterial', supportMaterial)
    if (evaluation) sessionStorage.setItem('writingEvaluation', JSON.stringify(evaluation))
  }, [topic, content, supportMaterial, evaluation])

  const handleGenerateNewTopic = async () => {
    setIsGenerating(true)
    try {
      const result = await generateEssayTopic()
      if (result) {
        setTopic(result.topic)
        setSupportMaterial(result.supportMaterial)
        toast.success('Tema gerado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao gerar tema:', error)
      toast.error('Erro ao gerar tema. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Por favor, escreva sua redação antes de avaliar.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await evaluateEssay(topic, content)
      setEvaluation(result)

      // Salva no banco de dados
      if (user) {
        await userService.saveWriting({
          user_id: user.id,
          topic,
          content,
          support_material: supportMaterial,
          feedback: result,
          created_at: new Date().toISOString()
        })
      }

      toast.success('Redação avaliada com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao avaliar redação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewEssay = () => {
    sessionStorage.clear()
    setTopic('')
    setContent('')
    setSupportMaterial('')
    setEvaluation(null)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          {!topic ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Redação</h2>
              <p className="text-muted-foreground mb-6">
                Clique no botão abaixo para gerar um novo tema
              </p>
              <Button 
                onClick={handleGenerateNewTopic}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    <span>Gerar Novo Tema</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <WritingPrompt
                topic={topic}
                supportMaterial={supportMaterial}
                onGenerateNewTopic={handleGenerateNewTopic}
                isGenerating={isGenerating}
              />
              
              {!evaluation ? (
                <div className="mt-6">
                  <WritingEditor
                    content={content}
                    onChange={setContent}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <WritingFeedback feedback={evaluation} />
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setShowEditor(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Editar Redação
                    </Button>
                    <Button 
                      onClick={handleNewEssay}
                      className="w-full"
                    >
                      Nova Redação
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}