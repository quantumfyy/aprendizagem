import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface WritingFeedbackProps {
  feedback: {
    score: number;
    competencies: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
    suggestions: string[];
  }
}

export function WritingFeedback({ feedback }: WritingFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 160) return "text-green-500";
    if (score >= 120) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 160) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 120) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Nota Total */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-center">
            Nota Final: <span className="text-primary text-2xl">{feedback.score}/1000</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Competências */}
      <div className="grid gap-4">
        {feedback.competencies.map((comp, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getScoreIcon(comp.score)}
                  <h3 className="font-semibold">{comp.name}</h3>
                </div>
                <span className={`font-bold ${getScoreColor(comp.score)}`}>
                  {comp.score}/200
                </span>
              </div>
              <Progress 
                value={(comp.score / 200) * 100} 
                className="mb-4"
              />
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {comp.feedback}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sugestões */}
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Melhoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-muted-foreground">
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}