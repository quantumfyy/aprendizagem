import { supabase } from './supabase'
import { WritingStats } from '@/types/writing'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
}

export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
  },

  async getUserWritings(userId: string): Promise<WritingStats[]> {
    const { data, error } = await supabase
      .from('writings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async saveWriting(writing: WritingStats) {
    const { data, error } = await supabase
      .from('writings')
      .insert({
        user_id: writing.user_id,
        topic: writing.topic,
        content: writing.content,
        support_material: writing.support_material,
        feedback: writing.feedback,
        created_at: writing.created_at
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getWritingById(id: string) {
    const { data, error } = await supabase
      .from('writings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}