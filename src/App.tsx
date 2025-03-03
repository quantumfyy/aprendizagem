import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProgressPage from "./pages/ProgressPage";
import QuizPage from "./pages/QuizPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import WritingPage from "./components/writing/WritingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route 
            path="/profile" 
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <Layout>
                <ProgressPage />
              </Layout>
            } 
          />
          <Route 
            path="/quiz" 
            element={
              <Layout>
                <QuizPage />
              </Layout>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <Layout>
                <ChatPage />
              </Layout>
            } 
          />
          <Route 
            path="/writing" 
            element={
              <Layout>
                <WritingPage />
              </Layout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
