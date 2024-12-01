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
      profiles: {
        Row: {
          id: string
          token_balance: number
          lifetime_purchased: number
          lifetime_used: number
          last_purchase_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          token_balance?: number
          lifetime_purchased?: number
          lifetime_used?: number
          last_purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token_balance?: number
          lifetime_purchased?: number
          lifetime_used?: number
          last_purchase_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          status: 'active' | 'completed' | 'on_hold'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'active' | 'completed' | 'on_hold'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'active' | 'completed' | 'on_hold'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      token_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS'
          description: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS'
          description: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS'
          description?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      token_usage: {
        Row: {
          id: string
          user_id: string
          tokens: number
          feature: string
          description: string
          project_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tokens: number
          feature: string
          description: string
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tokens?: number
          feature?: string
          description?: string
          project_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      token_daily_usage: {
        Row: {
          id: string
          user_id: string
          date: string
          tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          tokens: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
      token_feature_usage: {
        Row: {
          id: string
          user_id: string
          feature: string
          tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: string
          tokens: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature?: string
          tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
      token_project_usage: {
        Row: {
          id: string
          user_id: string
          project_id: string
          project_name: string
          tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          project_name: string
          tokens: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          project_name?: string
          tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_tokens: {
        Args: {
          amount_to_consume: number
          description?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 