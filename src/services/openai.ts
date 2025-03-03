import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface EssayEvaluation {
  score: number;
  competencies: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  suggestions: string[];
}

export async function generateEssayTopic() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em temas de redação do ENEM. Gere um tema atual e relevante, incluindo textos motivadores."
        },
        {
          role: "user",
          content: "Gere um tema de redação do ENEM com 3 textos motivadores. Formate a resposta com o tema em uma linha e os textos motivadores numerados abaixo."
        }
      ]
    });

    const result = response.choices[0].message.content;
    return {
      topic: result.split('\n')[0],
      supportMaterial: result.split('\n').slice(1).join('\n')
    };
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Falha ao gerar tema');
  }
}

export async function evaluateEssay(topic: string, content: string): Promise<EssayEvaluation> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um avaliador especialista do ENEM. Forneça uma avaliação detalhada seguindo ESTRITAMENTE o formato especificado.`
        },
        {
          role: "user",
          content: `
            Tema: ${topic}
            
            Redação:
            ${content}
            
            Avalie rigorosamente seguindo este formato exato:
            COMP1: [NÚMERO]
            [FEEDBACK]
            ---
            COMP2: [NÚMERO]
            [FEEDBACK]
            ---
            COMP3: [NÚMERO]
            [FEEDBACK]
            ---
            COMP4: [NÚMERO]
            [FEEDBACK]
            ---
            COMP5: [NÚMERO]
            [FEEDBACK]
            ===
            SUGESTÕES:
            - [SUGESTÃO 1]
            - [SUGESTÃO 2]
            - [SUGESTÃO 3]

            Onde:
            - [NÚMERO] deve ser um valor entre 0 e 200
            - [FEEDBACK] deve ser um texto explicativo
            - Mantenha exatamente os separadores '---' e '==='`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const result = response.choices[0].message.content;

    // Parse mais preciso
    const [competenciesText = '', suggestionsText = ''] = result.split('===').map(s => s.trim());
    const competenciesSections = competenciesText.split('---').map(s => s.trim());

    // Parse das competências com validação mais rigorosa
    const competencies = competenciesSections.map((section, index) => {
      try {
        const lines = section.split('\n').filter(Boolean);
        const scoreMatch = lines[0].match(/COMP\d+:\s*(\d+)/);
        const score = scoreMatch 
          ? Math.min(200, Math.max(0, parseInt(scoreMatch[1], 10)))
          : 0;
        const feedback = lines.slice(1).join('\n').trim();

        return {
          name: getCompetencyName(`COMP${index + 1}`),
          score,
          feedback: feedback || 'Não foi possível avaliar esta competência.'
        };
      } catch (e) {
        console.error(`Erro ao processar competência ${index + 1}:`, e);
        return {
          name: getCompetencyName(`COMP${index + 1}`),
          score: 0,
          feedback: 'Erro na avaliação desta competência.'
        };
      }
    });

    // Garante exatamente 5 competências
    const fullCompetencies = Array.from({ length: 5 }).map((_, index) => {
      return competencies[index] || {
        name: getCompetencyName(`COMP${index + 1}`),
        score: 0,
        feedback: 'Competência não avaliada.'
      };
    });

    // Parse das sugestões com validação
    const suggestions = suggestionsText
      .replace(/^SUGESTÕES:/i, '')
      .split('-')
      .map(s => s.trim())
      .filter(Boolean);

    // Calcula pontuação total
    const totalScore = fullCompetencies.reduce((acc, comp) => acc + comp.score, 0);

    return {
      score: totalScore,
      competencies: fullCompetencies,
      suggestions: suggestions.length > 0 
        ? suggestions 
        : ['Continue praticando para melhorar suas habilidades.']
    };
  } catch (error) {
    console.error('Erro na avaliação:', error);
    throw new Error('Falha ao avaliar redação');
  }
}

function getCompetencyName(comp: string): string {
  const names = {
    'COMP1': 'Domínio da norma culta',
    'COMP2': 'Compreensão do tema',
    'COMP3': 'Argumentação',
    'COMP4': 'Coesão textual',
    'COMP5': 'Proposta de intervenção'
  };
  return names[comp as keyof typeof names] || comp;
}