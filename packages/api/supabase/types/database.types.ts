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
      _FavoriteRestrooms: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_FavoriteRestrooms_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Restroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_FavoriteRestrooms_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Location: {
        Row: {
          id: string
          latitude: number
          longitude: number
          restroomId: string
        }
        Insert: {
          id: string
          latitude: number
          longitude: number
          restroomId: string
        }
        Update: {
          id?: string
          latitude?: number
          longitude?: number
          restroomId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Location_restroomId_fkey"
            columns: ["restroomId"]
            isOneToOne: false
            referencedRelation: "Restroom"
            referencedColumns: ["id"]
          },
        ]
      }
      Restroom: {
        Row: {
          accessible: boolean
          cleanlinessRating: number
          createdAt: string
          description: string | null
          fee: number | null
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          accessible: boolean
          cleanlinessRating: number
          createdAt?: string
          description?: string | null
          fee?: number | null
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          accessible?: boolean
          cleanlinessRating?: number
          createdAt?: string
          description?: string | null
          fee?: number | null
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Review: {
        Row: {
          comment: string | null
          createdAt: string
          id: string
          rating: number
          restroomId: string
          userId: string
        }
        Insert: {
          comment?: string | null
          createdAt?: string
          id: string
          rating: number
          restroomId: string
          userId: string
        }
        Update: {
          comment?: string | null
          createdAt?: string
          id?: string
          rating?: number
          restroomId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Review_restroomId_fkey"
            columns: ["restroomId"]
            isOneToOne: false
            referencedRelation: "Restroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          active: boolean | null
          avatar: string | null
          birthdate: string | null
          clerkId: string | null
          createdAt: string
          email: string | null
          fullName: string | null
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          onboarded: boolean
          phoneNumber: string | null
          updatedAt: string
          username: string | null
        }
        Insert: {
          active?: boolean | null
          avatar?: string | null
          birthdate?: string | null
          clerkId?: string | null
          createdAt?: string
          email?: string | null
          fullName?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id: string
          onboarded?: boolean
          phoneNumber?: string | null
          updatedAt: string
          username?: string | null
        }
        Update: {
          active?: boolean | null
          avatar?: string | null
          birthdate?: string | null
          clerkId?: string | null
          createdAt?: string
          email?: string | null
          fullName?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          onboarded?: boolean
          phoneNumber?: string | null
          updatedAt?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Gender: "Male" | "Female" | "PreferNotToSay"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
