export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          title: string
          description: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target: number
          progress: number
          streak: number
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          frequency: 'daily' | 'weekly' | 'monthly'
          target: number
          progress?: number
          streak?: number
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly'
          target?: number
          progress?: number
          streak?: number
          created_at?: string
          user_id?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          completed_at: string
          user_id: string
        }
        Insert: {
          id?: string
          habit_id: string
          completed_at?: string
          user_id: string
        }
        Update: {
          id?: string
          habit_id?: string
          completed_at?: string
          user_id?: string
        }
      }
    }
  }
}