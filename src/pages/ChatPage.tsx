import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, SendHorizontal, Search, User, Lightbulb, Sparkles, Bot, Clock, ArrowUpRight, BookOpen } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  date: string;
  unread?: boolean;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá, como posso te ajudar hoje?",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const chatHistories: ChatHistory[] = [
    { id: "1", title: "Course Recommendations", preview: "Can you recommend some courses...", date: "Today" },
    { id: "2", title: "Quiz Help", preview: "I'm stuck on the JavaScript quiz...", date: "Yesterday", unread: true },
    { id: "3", title: "Study Tips", preview: "How can I improve my study habits?", date: "Mar 15" },
    { id: "4", title: "Technical Issue", preview: "I can't access the video lecture...", date: "Mar 12" },
  ];

  const suggestedQuestions = [
    "How do I track my progress?",
    "Where can I find quiz results?",
    "How do I update my profile information?",
    "Can you explain the achievements system?",
    "How to contact a human tutor?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI thinking...
    setTimeout(() => {
      let response: string;
      
      if (input.toLowerCase().includes("progress")) {
        response = "You can track your progress on the Progress page. It shows your course completion rates, quiz scores, and learning trends over time. Would you like me to explain any specific feature?";
      } else if (input.toLowerCase().includes("quiz")) {
        response = "The Quiz section allows you to test your knowledge on various topics. You can see your past quiz results in the Progress page under the 'Course Progress' section. Is there a specific quiz you're looking for?";
      } else if (input.toLowerCase().includes("profile")) {
        response = "You can update your profile information in the Settings page. Go to the Profile tab and you'll find options to edit your personal details, profile picture, and bio. Need any help with specific fields?";
      } else if (input.toLowerCase().includes("achievement")) {
        response = "Achievements are rewards for reaching certain milestones in your learning journey. You can view your earned achievements in the Profile page. They're a great way to track your growth and stay motivated!";
      } else {
        response = "Thank you for your message! I'm here to help with any questions about using the platform, finding resources, or understanding course materials. Could you provide more details about what you need assistance with?";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-[calc(100vh-150px)] md:max-h-[850px]">
      <Card className="hidden md:flex w-80 flex-col glass-panel border-r rounded-r-none">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Chat History</CardTitle>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chatHistories.map((chat) => (
              <div 
                key={chat.id}
                className="p-3 rounded-lg hover:bg-accent/40 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium line-clamp-1">{chat.title}</h4>
                  <div className="flex items-center gap-1">
                    {chat.unread && (
                      <Badge className="h-2 w-2 p-0 rounded-full bg-primary" />
                    )}
                    <span className="text-xs text-muted-foreground">{chat.date}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{chat.preview}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 flex flex-col glass-panel rounded-l-none md:rounded-l-lg">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Assistente Educacional</CardTitle>
                <CardDescription className="text-xs">Estou aqui para te auxiliar!</CardDescription>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full justify-start mb-2">
              <TabsTrigger value="chat" className="flex gap-1 items-center">
                <Bot className="h-4 w-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex gap-1 items-center">
                <Lightbulb className="h-4 w-4" />
                <span>Central de ajuda</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-lg p-3 
                        ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground ml-10"
                            : "bg-muted/50 border mr-10"
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "assistant" && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="space-y-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex justify-end">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-6 w-6 mt-1">
                            <AvatarFallback className="text-xs">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <CardFooter className="border-t p-3">
              <div className="relative w-full flex space-x-2">
                <Input
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim()} 
                  size="icon"
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </TabsContent>

          <TabsContent value="help" className="flex-1 flex flex-col m-0 p-0 data-[state=active]:flex">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">How can we help you?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="bg-muted/50 hover:bg-accent/40 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Getting Started</h4>
                          <p className="text-xs text-muted-foreground">Learn the basics</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50 hover:bg-accent/40 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Course Guide</h4>
                          <p className="text-xs text-muted-foreground">How courses work</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50 hover:bg-accent/40 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Configurações da conta</h4>
                          <p className="text-xs text-muted-foreground">Manage your profile</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50 hover:bg-accent/40 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Suporte Tecnico</h4>
                          <p className="text-xs text-muted-foreground">Get help with issues</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Popular Articles</h3>
                  <div className="space-y-2">
                    {[
                      "How to reset your password",
                      "Understanding course progress tracking",
                      "Tips for achieving better quiz scores",
                      "Using the chat assistant effectively",
                      "Troubleshooting video playback issues"
                    ].map((article, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg hover:bg-accent/40 cursor-pointer transition-colors flex justify-between items-center"
                      >
                        <span className="text-sm">{article}</span>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Suggested Questions</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 cursor-pointer py-2 px-3"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
