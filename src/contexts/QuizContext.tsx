
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { generateQuiz } from "@/lib/openai";
import { QuizQuestion, QuizItem, GeneratedQuiz, QuizFormData } from "@/types/quiz";
import { BookOpen, BookMarked, BrainCircuit } from "lucide-react";

// Define the context state type
interface QuizContextType {
  // Quiz state
  activeQuiz: string | null;
  currentQuestion: number;
  selectedOption: string | null;
  answered: boolean;
  score: number;
  showResults: boolean;
  isGeneratingQuiz: boolean;
  generatedQuiz: GeneratedQuiz | null;
  
  // Quiz data
  availableQuizzes: QuizItem[];
  questions: QuizQuestion[];
  
  // Actions
  handleStartQuiz: (quizId: string) => void;
  handleSelectOption: (optionId: string) => void;
  handleNextQuestion: () => void;
  handleRestartQuiz: () => void;
  handleExitQuiz: () => void;
  onSubmitQuizForm: (values: QuizFormData) => Promise<void>;
}

// Create context with default values
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
export function QuizProvider({ children }: { children: ReactNode }) {
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);

  // Sample quizzes
  const availableQuizzes: QuizItem[] = [
    { id: "js-basics", title: "JavaScript Basics", questions: 10, difficulty: "Beginner", time: "15 min", icon: BookOpen },
    { id: "react-components", title: "React Components", questions: 8, difficulty: "Intermediate", time: "12 min", icon: BookMarked },
    { id: "css-layout", title: "CSS Layout Mastery", questions: 12, difficulty: "Advanced", time: "20 min", icon: BrainCircuit },
  ];

  // Sample questions for JavaScript Basics quiz
  const questions: QuizQuestion[] = [
    {
      id: 1,
      text: "Which of the following is a valid JavaScript variable declaration?",
      options: [
        { id: "a", text: "variable x = 5;", isCorrect: false },
        { id: "b", text: "let x = 5;", isCorrect: true },
        { id: "c", text: "x := 5;", isCorrect: false },
        { id: "d", text: "int x = 5;", isCorrect: false },
      ],
      explanation: "In JavaScript, variables can be declared using 'let', 'const', or 'var' keywords. 'let x = 5;' is the correct syntax for declaring a variable with the value 5.",
    },
    {
      id: 2,
      text: "What will be the output of: console.log(typeof []);",
      options: [
        { id: "a", text: "array", isCorrect: false },
        { id: "b", text: "object", isCorrect: true },
        { id: "c", text: "list", isCorrect: false },
        { id: "d", text: "undefined", isCorrect: false },
      ],
      explanation: "In JavaScript, arrays are actually objects, so 'typeof []' returns 'object'. This can be confusing as many would expect it to return 'array'.",
    },
    {
      id: 3,
      text: "Which method is used to add an element to the end of an array?",
      options: [
        { id: "a", text: "append()", isCorrect: false },
        { id: "b", text: "push()", isCorrect: true },
        { id: "c", text: "add()", isCorrect: false },
        { id: "d", text: "insertLast()", isCorrect: false },
      ],
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    },
    {
      id: 4,
      text: "What is the result of '2' + 2 in JavaScript?",
      options: [
        { id: "a", text: "4", isCorrect: false },
        { id: "b", text: "22", isCorrect: true },
        { id: "c", text: "Error", isCorrect: false },
        { id: "d", text: "'22'", isCorrect: false },
      ],
      explanation: "When you use the + operator with a string and a number, JavaScript converts the number to a string and performs string concatenation. So '2' + 2 results in the string '22'.",
    },
    {
      id: 5,
      text: "Which of these is NOT a JavaScript data type?",
      options: [
        { id: "a", text: "Boolean", isCorrect: false },
        { id: "b", text: "Undefined", isCorrect: false },
        { id: "c", text: "Float", isCorrect: true },
        { id: "d", text: "Symbol", isCorrect: false },
      ],
      explanation: "JavaScript has six primitive data types: Boolean, Null, Undefined, Number, String, and Symbol. It also has one complex data type: Object. There is no distinct 'Float' type - all numbers are of type 'Number'.",
    },
  ];

  const handleStartQuiz = (quizId: string) => {
    if (quizId === "generated" && generatedQuiz) {
      setActiveQuiz(quizId);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswered(false);
      setScore(0);
      setShowResults(false);
      toast(`Iniciando ${generatedQuiz.title}`, {
        description: "Boa sorte!",
      });
    } else {
      setActiveQuiz(quizId);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setAnswered(false);
      setScore(0);
      setShowResults(false);
      toast(`Iniciando ${availableQuizzes.find(q => q.id === quizId)?.title}`, {
        description: "Boa sorte!",
      });
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    
    const currentQ = activeQuiz === "generated" && generatedQuiz 
      ? generatedQuiz.questions[currentQuestion]
      : questions[currentQuestion];
      
    const selectedOpt = currentQ.options.find(opt => opt.id === optionId);
    
    if (selectedOpt?.isCorrect) {
      setScore(prev => prev + 1);
      toast.success("Resposta correta!");
    } else {
      toast.error("Resposta incorreta!");
    }
  };

  const handleNextQuestion = () => {
    const currentQuestions = activeQuiz === "generated" && generatedQuiz 
      ? generatedQuiz.questions
      : questions;
      
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
    setShowResults(false);
  };
  
  // Function to save quiz results
  const saveQuizResult = async () => {
    // In a complete implementation, we would save the results to Supabase
    
    // Simulating save for demonstration
    toast.success("Progresso salvo com sucesso!", {
      description: "Seu resultado foi armazenado."
    });
  };

  // Save results after displaying them
  useEffect(() => {
    if (showResults) {
      saveQuizResult();
    }
  }, [showResults]);
  
  // Function to generate quiz using OpenAI API
  const onSubmitQuizForm = async (values: QuizFormData) => {
    setIsGeneratingQuiz(true);
    
    try {
      // Call OpenAI API to generate the quiz
      const generatedQuestions = await generateQuiz({
        topic: values.topic,
        difficulty: values.difficulty,
        questionsCount: values.questionsCount
      });
      
      // Create generated quiz object
      const newGeneratedQuiz: GeneratedQuiz = {
        id: "generated",
        title: `${values.topic} Quiz`,
        difficulty: values.difficulty === "beginner" 
          ? "Iniciante" 
          : values.difficulty === "intermediate" 
            ? "Intermediário" 
            : "Avançado",
        time: `${Math.ceil(values.questionsCount * 1.5)} min`,
        questions: generatedQuestions
      };
      
      setGeneratedQuiz(newGeneratedQuiz);
      toast.success("Quiz gerado com sucesso!", {
        description: "Você pode iniciar quando quiser."
      });
      
    } catch (error) {
      console.error("Erro ao gerar quiz:", error);
      toast.error("Erro ao gerar o quiz", {
        description: "Por favor tente novamente."
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const value = {
    activeQuiz,
    currentQuestion,
    selectedOption,
    answered,
    score,
    showResults,
    isGeneratingQuiz,
    generatedQuiz,
    availableQuizzes,
    questions,
    handleStartQuiz,
    handleSelectOption,
    handleNextQuestion,
    handleRestartQuiz,
    handleExitQuiz,
    onSubmitQuizForm
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Custom hook to use the quiz context
export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
