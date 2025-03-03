import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: {
    achievements: any
    username: string
    name: string
    email: string
    avatar: string
    role: string
    bio: string
    joined: string
    coursesCompleted: number
    currentCourses: number
    recentActivity: Array<any>
  }
  updateUser: (userData: Partial<UserState['user']>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        achievements: null,
        username: 'nomeusuario',
        name: 'Nome do Usuário',
        email: 'usuario@email.com',
        avatar: '/avatar.png',
        role: 'Estudante',
        bio: 'Sua biografia aqui',
        joined: '2024',
        coursesCompleted: 0,
        currentCourses: 0,
        recentActivity: []
      },
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'user-storage', // nome para o storage no localStorage
    }
  )
)