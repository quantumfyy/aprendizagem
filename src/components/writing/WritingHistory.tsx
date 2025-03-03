import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userService } from '@/services/userService'
import { WritingStats } from '@/types/writing'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, TrendingUp } from 'lucide-react'

interface WritingHistoryProps {
  userId: string
  onSelect: (writing: WritingStats) => void
}

export function WritingHistory({ userId, onSelect }: WritingHistoryProps) {
  const [writings, setWritings] = useState<WritingStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWritings()
  }, [userId])

  const loadWritings = async () => {
    try {
      const data = await userService.getUserWritings(userId)
      setWritings(data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Card de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso nas Redações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {writings.length} {writings.length === 1 ? 'redação' : 'redações'} completadas
          </div>
        </CardContent>
      </Card>

      {/* Lista de Redações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Redações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {writings.map((writing) => (
              <div
                key={writing.id}
                onClick={() => onSelect(writing)}
                className="p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium line-clamp-2">{writing.topic}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(writing.created_at!), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-primary">
                      {writing.feedback?.score}/1000
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {writings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma redação encontrada
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}