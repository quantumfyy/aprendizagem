import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useEffect, useState } from 'react';
import { essayStorage } from '@/services/essayStorage';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WritingMetrics {
  totalEssays: number
  averageScore: number
  bestScore: number
  essaysThisMonth: number
  improvementRate: number
}

interface CompetencyScore {
  name: string
  score: number
}

interface EssayHistory {
  date: string
  score: number
}

export default function WritingStats() {
  const { toast } = useToast();
  const [stats, setStats] = useState<WritingMetrics & {
    history: EssayHistory[];
    competencies: CompetencyScore[];
  }>({
    totalEssays: 0,
    averageScore: 0,
    bestScore: 0,
    essaysThisMonth: 0,
    improvementRate: 0,
    history: [],
    competencies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await essayStorage.getEssayStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível carregar suas estatísticas de redação.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Observa mudanças nas redações
    const unsubscribe = essayStorage.subscribe(() => {
      void fetchStats();
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Métricas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Redações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEssays}</div>
          <p className="text-xs text-muted-foreground">
            {stats.essaysThisMonth} este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}</div>
          <p className="text-xs text-muted-foreground">
            Melhor nota: {stats.bestScore}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Melhoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{stats.improvementRate}%</div>
          <p className="text-xs text-muted-foreground">
            Desde a primeira redação
          </p>
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Evolução */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Evolução das Notas</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1000]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8884d8" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico Radar - Competências */}
      <Card className="col-span-4 md:col-span-2">
        <CardHeader>
          <CardTitle>Competências</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={stats.competencies}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 200]} />
              <Radar
                name="Pontuação"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}