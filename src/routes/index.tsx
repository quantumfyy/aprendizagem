import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import Profile from '@/pages/ProfilePage'
import WritingPage from '@/components/writing/WritingPage'
import Chat from '@/pages/ChatPage'
import Quiz from '@/pages/QuizPage'
import Progress from '@/pages/ProgressPage'
import Settings from '@/pages/SettingsPage'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import { QuizProvider } from '@/contexts/QuizContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <QuizProvider>
      <Layout>{children}</Layout>
    </QuizProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/profile" replace />
  },
  {
    path: '/login',
    element: <SignIn />
  },
  {
    path: '/register',
    element: <SignUp />
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/writing',
    element: <ProtectedRoute><WritingPage /></ProtectedRoute>
  },
  {
    path: '/chat',
    element: <ProtectedRoute><Chat /></ProtectedRoute>
  },
  {
    path: '/quiz',
    element: <ProtectedRoute><Quiz /></ProtectedRoute>
  },
  {
    path: '/progress',
    element: <ProtectedRoute><Progress /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: '*',
    element: <Navigate to="/profile" replace />
  }
])