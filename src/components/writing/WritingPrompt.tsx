import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Bot, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface WritingPromptProps {
  topic: string
  supportMaterial: string
  onGenerateNewTopic: () => void
  isGenerating: boolean
}

export function WritingPrompt({ 
  topic, 
  supportMaterial, 
  onGenerateNewTopic,
  isGenerating 
}: WritingPromptProps) {
  const enemRules = [
    "Texto dissertativo-argumentativo com no mínimo 7 e no máximo 30 linhas",
    "Proposta de intervenção detalhada e relacionada ao tema",
    "Não fuja do tema proposto",
    "Não copie trechos dos textos motivadores",
    "Respeite os direitos humanos"
  ]

  return (
    <Card className={`relative transition-all duration-500 ${isGenerating ? 'animate-pulse' : 'hover:shadow-md'}`}>
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-4">
            <Bot className="h-12 w-12 mx-auto animate-bounce text-primary" />
            <p className="text-lg font-medium">Gerando tema com IA...</p>
            <p className="text-sm text-muted-foreground">Aguarde enquanto nosso assistente prepara um tema relevante</p>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Tema da Redação
            <Bot className="h-4 w-4 text-primary" />
          </CardTitle>
          <Button 
            variant="outline"
            onClick={onGenerateNewTopic}
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
                Novo Tema
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tema */}
        <div className="transition-all duration-300">
          <h3 className="font-semibold mb-2 text-lg">Proposta de Redação:</h3>
          <p className="text-lg leading-relaxed font-medium">
            {topic || 'Clique em "Novo Tema" para começar'}
          </p>
        </div>
        
        {/* Textos Motivadores */}
        {supportMaterial && (
          <div className="transition-all duration-300">
            <h3 className="font-semibold mb-4 text-lg">Textos Motivadores:</h3>
            <div className="prose prose-slate max-w-none space-y-4">
              {supportMaterial.split('\n\n').map((block, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50">
                  {block.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regras do ENEM */}
        <Alert variant="default" className="bg-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <h4 className="font-semibold mb-2">Instruções:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {enemRules.map((rule, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {rule}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}