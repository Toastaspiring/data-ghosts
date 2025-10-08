export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      leaderboard: {
        Row: {
          finished_at: string
          id: number
          lobby_id: string | null
        }
        Insert: {
          finished_at: string
          id?: number
          lobby_id?: string | null
        }
        Update: {
          finished_at?: string
          id?: number
          lobby_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_lobby_id_fkey"
            columns: ["lobby_id"]
            isOneToOne: false
            referencedRelation: "lobbies"
            referencedColumns: ["id"]
          },
        ]
      }
      lobbies: {
        Row: {
          code: number
          collected_codes: Json | null
          completed_puzzles: Json | null
          created_at: string
          current_room: number | null
          game_state: Json
          hints_used: number | null
          id: string
          last_hint_time: string | null
          name: string
          parallel_mode: boolean | null
          player_assignments: Json | null
          players: Json
          solution: string
          status: string
        }
        Insert: {
          code: number
          collected_codes?: Json | null
          completed_puzzles?: Json | null
          created_at?: string
          current_room?: number | null
          game_state?: Json
          hints_used?: number | null
          id?: string
          last_hint_time?: string | null
          name: string
          parallel_mode?: boolean | null
          player_assignments?: Json | null
          players?: Json
          solution: string
          status?: string
        }
        Update: {
          code?: number
          collected_codes?: Json | null
          completed_puzzles?: Json | null
          created_at?: string
          current_room?: number | null
          game_state?: Json
          hints_used?: number | null
          id?: string
          last_hint_time?: string | null
          name?: string
          parallel_mode?: boolean | null
          player_assignments?: Json | null
          players?: Json
          solution?: string
          status?: string
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          answer: string | null
          created_at: string
          description: string
          hint: string | null
          id: string
          order_index: number
          puzzle_data: Json
          puzzle_type: string
          room_id: string
          title: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          description: string
          hint?: string | null
          id?: string
          order_index: number
          puzzle_data?: Json
          puzzle_type: string
          room_id: string
          title: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          description?: string
          hint?: string | null
          id?: string
          order_index?: number
          puzzle_data?: Json
          puzzle_type?: string
          room_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          code_reward: string | null
          created_at: string
          description: string
          destination_name: string | null
          environmental_context: Json | null
          id: string
          order_index: number
          room_number: number
          theme: string
          title: string
          token_name: string | null
        }
        Insert: {
          code_reward?: string | null
          created_at?: string
          description: string
          destination_name?: string | null
          environmental_context?: Json | null
          id?: string
          order_index: number
          room_number: number
          theme: string
          title: string
          token_name?: string | null
        }
        Update: {
          code_reward?: string | null
          created_at?: string
          description?: string
          destination_name?: string | null
          environmental_context?: Json | null
          id?: string
          order_index?: number
          room_number?: number
          theme?: string
          title?: string
          token_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_puzzle_answer: {
        Args: { puzzle_id: string; submitted_answer: string }
        Returns: boolean
      }
      get_puzzle_for_game: {
        Args: { puzzle_id: string }
        Returns: {
          description: string
          hint: string
          id: string
          order_index: number
          puzzle_data: Json
          puzzle_type: string
          room_id: string
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
