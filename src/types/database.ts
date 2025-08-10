// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          full_name: string | null
          email: string | null
          xp_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          full_name?: string | null
          email?: string | null
          xp_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          full_name?: string | null
          email?: string | null
          xp_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          wallet_address: string
          display_name: string | null
          email: string | null
          xp_points: number
          monthly_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          display_name?: string | null
          email?: string | null
          xp_points?: number
          monthly_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          display_name?: string | null
          email?: string | null
          xp_points?: number
          monthly_credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          owner_id: string
          artifact_id: string
          title: string
          category: string
          estimated_value: number | null
          serial_number: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          proof_document_url: string | null
          bill_url: string | null
          id_url: string | null
          ai_ppd_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          artifact_id: string
          title: string
          category: string
          estimated_value?: number | null
          serial_number?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          proof_document_url?: string | null
          bill_url?: string | null
          id_url?: string | null
          ai_ppd_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          artifact_id?: string
          title?: string
          category?: string
          estimated_value?: number | null
          serial_number?: string | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          proof_document_url?: string | null
          bill_url?: string | null
          id_url?: string | null
          ai_ppd_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      co_owners: {
        Row: {
          id: string
          item_id: string
          co_owner_id: string
          role: 'primary' | 'secondary' | 'viewer'
          added_at: string
        }
        Insert: {
          id?: string
          item_id: string
          co_owner_id: string
          role: 'primary' | 'secondary' | 'viewer'
          added_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          co_owner_id?: string
          role?: 'primary' | 'secondary' | 'viewer'
          added_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          item_id: string
          from_owner_id: string
          to_owner_id: string
          tx_type: 'transfer' | 'sale' | 'co_owner_add' | 'co_owner_remove'
          tx_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          from_owner_id: string
          to_owner_id: string
          tx_type: 'transfer' | 'sale' | 'co_owner_add' | 'co_owner_remove'
          tx_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          from_owner_id?: string
          to_owner_id?: string
          tx_type?: 'transfer' | 'sale' | 'co_owner_add' | 'co_owner_remove'
          tx_hash?: string | null
          created_at?: string
        }
      }
      xp_logs: {
        Row: {
          id: string
          user_id: string
          item_id: string | null
          xp_amount: number
          reason: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id?: string | null
          xp_amount: number
          reason: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string | null
          xp_amount?: number
          reason?: string
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          auto_delete_proofs_after_days: number | null
          analytics_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          auto_delete_proofs_after_days?: number | null
          analytics_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          auto_delete_proofs_after_days?: number | null
          analytics_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      verification_status: 'pending' | 'verified' | 'rejected'
      co_owner_role: 'primary' | 'secondary' | 'viewer'
      transaction_type: 'transfer' | 'sale' | 'co_owner_add' | 'co_owner_remove'
    }
  }
}
