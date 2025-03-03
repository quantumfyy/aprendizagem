
import OpenAI from 'openai';

// Em um ambiente de produção, a chave API deve ser gerenciada no backend usando Supabase Edge Functions
// Por enquanto, usaremos uma solução temporária com uma variável de ambiente
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Inicializar o cliente OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento. Em produção, use Supabase Edge Functions
});

// Interface para a geração de quiz
export interface GenerateQuizParams {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionsCount: number;
}

// Interface para a resposta da geração de quiz
export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export async function generateQuiz(params: GenerateQuizParams): Promise<QuizQuestion[]> {
  try {
    // Formatar o prompt para o modelo da OpenAI
    const prompt = `
    Crie um quiz sobre ${params.topic} com ${params.questionsCount} perguntas de nível ${
      params.difficulty === 'beginner' ? 'iniciante' : 
      params.difficulty === 'intermediate' ? 'intermediário' : 'avançado'
    }.
    
    As perguntas devem ter 4 opções de resposta cada, com apenas uma resposta correta.
    Inclua também uma explicação detalhada para cada pergunta.
    
    Retorne o resultado em JSON com este formato exato:
    [
      {
        "id": 1,
        "text": "Texto da pergunta",
        "options": [
          { "id": "a", "text": "Opção A", "isCorrect": false },
          { "id": "b", "text": "Opção B", "isCorrect": true },
          { "id": "c", "text": "Opção C", "isCorrect": false },
          { "id": "d", "text": "Opção D", "isCorrect": false }
        ],
        "explanation": "Explicação da resposta correta"
      },
      ...
    ]
    
    Responda APENAS com o JSON, sem textos adicionais.
    `;

    // Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usando o modelo especificado pelo usuário
      messages: [
        { role: "system", content: "Você é um especialista na criação de quizzes educacionais. Responda apenas com o JSON solicitado." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Ajustar para equilíbrio entre criatividade e precisão
    });

    // Extrair e processar a resposta
    const content = response.choices[0].message.content;
    if (!content) throw new Error("A API não retornou conteúdo");

    // Extrair o JSON da resposta
    let jsonContent = content;
    // Verificar se o texto contém delimitadores de código ou texto extra
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    // Analisar o JSON
    const questions = JSON.parse(jsonContent) as QuizQuestion[];
    
    return questions;
  } catch (error) {
    console.error("Erro na geração do quiz:", error);
    throw error;
  }
}
