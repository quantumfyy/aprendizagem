import { WritingEditorProps } from '@/types/writing'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'

export function WritingEditor({ content, onChange, onSubmit, isSubmitting }: WritingEditorProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 rounded-lg border resize-none"
        placeholder="Escreva sua redação aqui..."
      />
      <Button 
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando sua redação...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Finalizar e Avaliar Redação
          </>
        )}
      </Button>
    </div>
  )
}