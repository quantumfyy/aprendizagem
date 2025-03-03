import { supabase } from './supabase'

export interface AuthError {
  message: string
  status: number
}

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

class AuthService {
  async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw this.handleError(error)
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw this.handleError(error)
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw this.handleError(error)
  }

  private handleError(error: any): AuthError {
    console.error('Auth error:', error)
    return {
      message: error.message || 'Ocorreu um erro. Por favor, tente novamente.',
      status: error.status || 500
    }
  }
}

export const auth = new AuthService()