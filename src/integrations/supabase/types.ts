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
      achievement_badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      agent_badges: {
        Row: {
          agent_id: string
          badge_id: string
          earned_at: string
          id: string
        }
        Insert: {
          agent_id: string
          badge_id: string
          earned_at?: string
          id?: string
        }
        Update: {
          agent_id?: string
          badge_id?: string
          earned_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_badges_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "achievement_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_performance: {
        Row: {
          agent_id: string
          avg_conversion_time_days: number | null
          conversion_rate: number | null
          converted_leads: number
          id: string
          insurance_type: string
          last_updated: string
          total_leads: number
        }
        Insert: {
          agent_id: string
          avg_conversion_time_days?: number | null
          conversion_rate?: number | null
          converted_leads?: number
          id?: string
          insurance_type: string
          last_updated?: string
          total_leads?: number
        }
        Update: {
          agent_id?: string
          avg_conversion_time_days?: number | null
          conversion_rate?: number | null
          converted_leads?: number
          id?: string
          insurance_type?: string
          last_updated?: string
          total_leads?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_performance_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          article_slug: string
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          article_slug: string
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          article_slug?: string
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_transfers: {
        Row: {
          assigned_to: string | null
          conversation_history: Json
          created_at: string
          id: string
          status: string
          transfer_reason: string | null
          updated_at: string
          visitor_email: string
          visitor_name: string | null
          visitor_phone: string | null
        }
        Insert: {
          assigned_to?: string | null
          conversation_history?: Json
          created_at?: string
          id?: string
          status?: string
          transfer_reason?: string | null
          updated_at?: string
          visitor_email: string
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Update: {
          assigned_to?: string | null
          conversation_history?: Json
          created_at?: string
          id?: string
          status?: string
          transfer_reason?: string | null
          updated_at?: string
          visitor_email?: string
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Relationships: []
      }
      contact_callbacks: {
        Row: {
          assigned_to: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          last_contacted_at: string | null
          lead_score: number | null
          lead_source: string | null
          message: string | null
          next_follow_up: string | null
          notes: string | null
          phone: string
          preferred_time: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          message?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone: string
          preferred_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          message?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string
          preferred_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_tracking: {
        Row: {
          click_count: number
          clicked_at: string | null
          created_at: string
          email_type: string
          id: string
          last_event_at: string
          open_count: number
          opened_at: string | null
          quote_id: string | null
          recipient_email: string
          recipient_name: string
          resend_email_id: string | null
          sent_at: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          click_count?: number
          clicked_at?: string | null
          created_at?: string
          email_type: string
          id?: string
          last_event_at?: string
          open_count?: number
          opened_at?: string | null
          quote_id?: string | null
          recipient_email: string
          recipient_name: string
          resend_email_id?: string | null
          sent_at?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          click_count?: number
          clicked_at?: string | null
          created_at?: string
          email_type?: string
          id?: string
          last_event_at?: string
          open_count?: number
          opened_at?: string | null
          quote_id?: string | null
          recipient_email?: string
          recipient_name?: string
          resend_email_id?: string | null
          sent_at?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_tracking_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "insurance_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      google_ads_campaigns: {
        Row: {
          budget_daily: number | null
          budget_total: number | null
          campaign_id: string
          campaign_name: string
          conversion_value: number | null
          created_at: string
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_impressions: number | null
          total_spend: number | null
          updated_at: string
        }
        Insert: {
          budget_daily?: number | null
          budget_total?: number | null
          campaign_id: string
          campaign_name: string
          conversion_value?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_impressions?: number | null
          total_spend?: number | null
          updated_at?: string
        }
        Update: {
          budget_daily?: number | null
          budget_total?: number | null
          campaign_id?: string
          campaign_name?: string
          conversion_value?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          total_clicks?: number | null
          total_conversions?: number | null
          total_impressions?: number | null
          total_spend?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      google_ads_conversions: {
        Row: {
          campaign_id: string | null
          click_cost: number | null
          conversion_type: string
          conversion_value: number
          created_at: string
          id: string
          insurance_type: string | null
          lead_id: string | null
          postal_code: string | null
          source: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          campaign_id?: string | null
          click_cost?: number | null
          conversion_type: string
          conversion_value: number
          created_at?: string
          id?: string
          insurance_type?: string | null
          lead_id?: string | null
          postal_code?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          campaign_id?: string | null
          click_cost?: number | null
          conversion_type?: string
          conversion_value?: number
          created_at?: string
          id?: string
          insurance_type?: string | null
          lead_id?: string | null
          postal_code?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      insurance_quotes: {
        Row: {
          assigned_to: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          insurance_type: string
          last_contacted_at: string | null
          lead_score: number | null
          lead_source: string | null
          next_follow_up: string | null
          notes: string | null
          phone: string
          quote_data: Json
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          insurance_type: string
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone: string
          quote_data: Json
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          insurance_type?: string
          last_contacted_at?: string | null
          lead_score?: number | null
          lead_source?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string
          quote_data?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_redistribution_log: {
        Row: {
          created_at: string
          from_agent: string | null
          id: string
          lead_id: string
          lead_type: string
          reason: string
          to_agent: string | null
        }
        Insert: {
          created_at?: string
          from_agent?: string | null
          id?: string
          lead_id: string
          lead_type: string
          reason: string
          to_agent?: string | null
        }
        Update: {
          created_at?: string
          from_agent?: string | null
          id?: string
          lead_id?: string
          lead_type?: string
          reason?: string
          to_agent?: string | null
        }
        Relationships: []
      }
      monthly_goals: {
        Row: {
          agent_id: string
          created_at: string
          current_conversions: number
          current_leads: number
          current_revenue: number | null
          goal_conversions: number
          goal_leads: number
          goal_revenue: number | null
          id: string
          month: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          current_conversions?: number
          current_leads?: number
          current_revenue?: number | null
          goal_conversions?: number
          goal_leads?: number
          goal_revenue?: number | null
          id?: string
          month: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          current_conversions?: number
          current_leads?: number
          current_revenue?: number | null
          goal_conversions?: number
          goal_leads?: number
          goal_revenue?: number | null
          id?: string
          month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_goals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: string
          status: string
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_leads: {
        Row: {
          answers: Json
          created_at: string
          email: string
          full_name: string
          id: string
          recommendations: string | null
          updated_at: string
        }
        Insert: {
          answers: Json
          created_at?: string
          email: string
          full_name: string
          id?: string
          recommendations?: string | null
          updated_at?: string
        }
        Update: {
          answers?: Json
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          recommendations?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sales_agents: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          max_daily_leads: number
          phone: string | null
          specializations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          max_daily_leads?: number
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          max_daily_leads?: number
          phone?: string | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          article_slug: string | null
          author_name: string | null
          content: string | null
          created_at: string | null
          id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          article_slug?: string | null
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          article_slug?: string | null
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_assignment_score: {
        Args: {
          p_agent_id: string
          p_insurance_type: string
          p_lead_score: number
        }
        Returns: number
      }
      calculate_campaign_metrics: {
        Args: never
        Returns: {
          campaign_id: string
          campaign_name: string
          conversion_rate: number
          conversion_value: number
          cost_per_lead: number
          roi_percentage: number
          total_conversions: number
          total_spend: number
        }[]
      }
      cleanup_old_deleted_items: { Args: never; Returns: undefined }
      get_agent_current_load: { Args: { p_agent_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reassign_pending_leads: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
