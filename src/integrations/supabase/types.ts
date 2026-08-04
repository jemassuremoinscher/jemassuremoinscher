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
      activities: {
        Row: {
          action_type: string
          author_id: string | null
          created_at: string
          deal_id: string
          description: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action_type: string
          author_id?: string | null
          created_at?: string
          deal_id: string
          description?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action_type?: string
          author_id?: string | null
          created_at?: string
          deal_id?: string
          description?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      advice_records: {
        Row: {
          advisor_id: string | null
          advisor_name: string | null
          client_decision: string | null
          client_needs: string
          client_situation: string | null
          contact_id: string | null
          contract_id: string | null
          created_at: string
          deal_id: string | null
          delivered_at: string
          document_url: string | null
          id: string
          recommendation: string
          recommendation_reason: string
          solutions_studied: Json
        }
        Insert: {
          advisor_id?: string | null
          advisor_name?: string | null
          client_decision?: string | null
          client_needs: string
          client_situation?: string | null
          contact_id?: string | null
          contract_id?: string | null
          created_at?: string
          deal_id?: string | null
          delivered_at?: string
          document_url?: string | null
          id?: string
          recommendation: string
          recommendation_reason: string
          solutions_studied?: Json
        }
        Update: {
          advisor_id?: string | null
          advisor_name?: string | null
          client_decision?: string | null
          client_needs?: string
          client_situation?: string | null
          contact_id?: string | null
          contract_id?: string | null
          created_at?: string
          deal_id?: string | null
          delivered_at?: string
          document_url?: string | null
          id?: string
          recommendation?: string
          recommendation_reason?: string
          solutions_studied?: Json
        }
        Relationships: [
          {
            foreignKeyName: "advice_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "client_360"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "advice_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "opportunites_multi_equipement"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "advice_records_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_records_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "advice_records_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_records_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
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
          signed_before_hot: boolean | null
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
          signed_before_hot?: boolean | null
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
          signed_before_hot?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_callbacks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          rgpd_consent: boolean
          rgpd_consent_at: string | null
          source: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          rgpd_consent?: boolean
          rgpd_consent_at?: string | null
          source?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          rgpd_consent?: boolean
          rgpd_consent_at?: string | null
          source?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          assigned_to: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          commission_recurring: number | null
          commission_year_one: number | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          effective_date: string
          id: string
          insurance_type: string
          insurer_name: string | null
          notes: string | null
          policy_number: string | null
          premium_annual: number | null
          renewal_date: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          commission_recurring?: number | null
          commission_year_one?: number | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          effective_date: string
          id?: string
          insurance_type: string
          insurer_name?: string | null
          notes?: string | null
          policy_number?: string | null
          premium_annual?: number | null
          renewal_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          commission_recurring?: number | null
          commission_year_one?: number | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          effective_date?: string
          id?: string
          insurance_type?: string
          insurer_name?: string | null
          notes?: string | null
          policy_number?: string | null
          premium_annual?: number | null
          renewal_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "client_360"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contracts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "opportunites_multi_equipement"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "contracts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "contracts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      cron_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      deal_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          deal_id: string
          field_name: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          deal_id: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          deal_id?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_audit_log_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "deal_audit_log_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_audit_log_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      deal_tasks: {
        Row: {
          assigned_to: string | null
          category: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_at: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "lead_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_commission: number | null
          assigned_to: string | null
          contact_id: string | null
          created_at: string
          deleted_at: string | null
          estimated_commission: number | null
          id: string
          insurance_type: string
          lead_score: number | null
          notes: string | null
          source_id: string | null
          source_type: string | null
          stage: Database["public"]["Enums"]["deal_stage"]
          updated_at: string
        }
        Insert: {
          actual_commission?: number | null
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          deleted_at?: string | null
          estimated_commission?: number | null
          id?: string
          insurance_type: string
          lead_score?: number | null
          notes?: string | null
          source_id?: string | null
          source_type?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
        }
        Update: {
          actual_commission?: number | null
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          deleted_at?: string | null
          estimated_commission?: number | null
          id?: string
          insurance_type?: string
          lead_score?: number | null
          notes?: string | null
          source_id?: string | null
          source_type?: string | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "client_360"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "opportunites_multi_equipement"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          deal_id: string
          drive_url: string | null
          file_path: string | null
          id: string
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["doc_status"]
          updated_at: string
          uploaded_at: string | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          drive_url?: string | null
          file_path?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          updated_at?: string
          uploaded_at?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          drive_url?: string | null
          file_path?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          updated_at?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "alertes_conformite_dda"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_dormants"
            referencedColumns: ["deal_id"]
          },
        ]
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
          signed_before_hot: boolean | null
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
          signed_before_hot?: boolean | null
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
          signed_before_hot?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_quotes_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
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
      linkedin_auto_posts: {
        Row: {
          article_slug: string
          article_title: string
          article_url: string | null
          channel_overrides: Json
          created_at: string
          error_message: string | null
          facebook_status: string
          id: string
          image_url: string | null
          linkedin_status: string
          post_content: string | null
          posted_at: string | null
          provider: string
          response_payload: Json | null
          scheduled_at: string | null
          short_description: string | null
          status: string
        }
        Insert: {
          article_slug: string
          article_title: string
          article_url?: string | null
          channel_overrides?: Json
          created_at?: string
          error_message?: string | null
          facebook_status?: string
          id?: string
          image_url?: string | null
          linkedin_status?: string
          post_content?: string | null
          posted_at?: string | null
          provider?: string
          response_payload?: Json | null
          scheduled_at?: string | null
          short_description?: string | null
          status?: string
        }
        Update: {
          article_slug?: string
          article_title?: string
          article_url?: string | null
          channel_overrides?: Json
          created_at?: string
          error_message?: string | null
          facebook_status?: string
          id?: string
          image_url?: string | null
          linkedin_status?: string
          post_content?: string | null
          posted_at?: string | null
          provider?: string
          response_payload?: Json | null
          scheduled_at?: string | null
          short_description?: string | null
          status?: string
        }
        Relationships: []
      }
      linkedin_config: {
        Row: {
          created_at: string
          facebook_enabled: boolean
          id: string
          is_active: boolean
          linkedin_enabled: boolean
          post_day: string
          post_hour: number
          provider: string
          updated_at: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          facebook_enabled?: boolean
          id?: string
          is_active?: boolean
          linkedin_enabled?: boolean
          post_day?: string
          post_hour?: number
          provider?: string
          updated_at?: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          facebook_enabled?: boolean
          id?: string
          is_active?: boolean
          linkedin_enabled?: boolean
          post_day?: string
          post_hour?: number
          provider?: string
          updated_at?: string
          webhook_url?: string
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
          source: string
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
          source?: string
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
          source?: string
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          read_at: string | null
          title: string
          type: string
          url: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          url?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      page_meta_overrides: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_title: string | null
          page_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_title?: string | null
          page_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_title?: string | null
          page_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      published_drafts: {
        Row: {
          published_at: string
          published_by: string | null
          short_description: string | null
          slug: string
        }
        Insert: {
          published_at?: string
          published_by?: string | null
          short_description?: string | null
          slug: string
        }
        Update: {
          published_at?: string
          published_by?: string | null
          short_description?: string | null
          slug?: string
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
      quote_funnel_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          insurance_type: string | null
          metadata: Json | null
          session_id: string
          step_id: string | null
          step_index: number
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          insurance_type?: string | null
          metadata?: Json | null
          session_id: string
          step_id?: string | null
          step_index: number
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          insurance_type?: string | null
          metadata?: Json | null
          session_id?: string
          step_id?: string | null
          step_index?: number
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      seo_article_suggestions: {
        Row: {
          category: string | null
          created_at: string
          gsc_clicks: number | null
          gsc_impressions: number | null
          gsc_position: number | null
          id: string
          image_url: string | null
          legacy_id: string | null
          noindex: boolean
          published_at: string | null
          read_time: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          short_description: string | null
          slug: string
          social_headlines: Json | null
          source: string
          status: string
          suggested_author: string | null
          suggested_content: string
          suggested_meta_description: string | null
          tags: string[] | null
          target_keyword: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          gsc_clicks?: number | null
          gsc_impressions?: number | null
          gsc_position?: number | null
          id?: string
          image_url?: string | null
          legacy_id?: string | null
          noindex?: boolean
          published_at?: string | null
          read_time?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          short_description?: string | null
          slug: string
          social_headlines?: Json | null
          source?: string
          status?: string
          suggested_author?: string | null
          suggested_content: string
          suggested_meta_description?: string | null
          tags?: string[] | null
          target_keyword?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          gsc_clicks?: number | null
          gsc_impressions?: number | null
          gsc_position?: number | null
          id?: string
          image_url?: string | null
          legacy_id?: string | null
          noindex?: boolean
          published_at?: string | null
          read_time?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          short_description?: string | null
          slug?: string
          social_headlines?: Json | null
          source?: string
          status?: string
          suggested_author?: string | null
          suggested_content?: string
          suggested_meta_description?: string | null
          tags?: string[] | null
          target_keyword?: string | null
          title?: string
        }
        Relationships: []
      }
      sitemap_submission_log: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          http_status: number | null
          id: string
          response_body: string | null
          site_url: string
          sitemap_url: string
          status: string
          trigger_source: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_body?: string | null
          site_url: string
          sitemap_url: string
          status: string
          trigger_source: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_body?: string | null
          site_url?: string
          sitemap_url?: string
          status?: string
          trigger_source?: string
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
      alertes_conformite_dda: {
        Row: {
          commercial: string | null
          deal_id: string | null
          depuis: string | null
          email: string | null
          full_name: string | null
          insurance_type: string | null
          jours_sans_conseil: number | null
          stage: string | null
        }
        Relationships: []
      }
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
      client_360: {
        Row: {
          a_document_conseil: boolean | null
          commission_recurrente: number | null
          contact_id: string | null
          dernier_contrat_le: string | null
          email: string | null
          full_name: string | null
          mono_produit: boolean | null
          nb_contrats_actifs: number | null
          nb_deals: number | null
          phone: string | null
          prime_totale: number | null
          prochaine_echeance: string | null
          produits_detenus: string[] | null
        }
        Relationships: []
      }
      deals_dormants: {
        Row: {
          commercial: string | null
          deal_id: string | null
          derniere_activite: string | null
          email: string | null
          full_name: string | null
          insurance_type: string | null
          jours_sans_activite: number | null
          lead_score: number | null
          phone: string | null
          stage: string | null
        }
        Relationships: []
      }
      opportunites_multi_equipement: {
        Row: {
          commission_recurrente: number | null
          contact_id: string | null
          email: string | null
          full_name: string | null
          nb_contrats_actifs: number | null
          phone: string | null
          prime_totale: number | null
          prochaine_echeance: string | null
          produit_suggere: string | null
          produits_detenus: string[] | null
        }
        Relationships: []
      }
      tableau_bord_portefeuille: {
        Row: {
          clients_mono_produit: number | null
          clients_sans_conseil_dda: number | null
          commissions_recurrentes: number | null
          contrats_actifs: number | null
          deals_dormants: number | null
          echeances_60j: number | null
          primes_sous_gestion: number | null
          resiliations_12m: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      build_social_short_description: {
        Args: { _content?: string; _meta?: string; _title: string }
        Returns: string
      }
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
      create_deal_task_if_missing: {
        Args: {
          _category: string
          _deal_id: string
          _description: string
          _due_at: string
          _priority: string
          _title: string
        }
        Returns: undefined
      }
      current_actor_name: { Args: never; Returns: string }
      generate_unique_seo_article_slug: {
        Args: { _base_slug: string; _exclude_id?: string }
        Returns: string
      }
      generer_taches_renouvellement: {
        Args: never
        Returns: {
          taches_creees: number
        }[]
      }
      get_agent_current_load: { Args: { p_agent_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_valid_email: { Args: { _email: string }; Returns: boolean }
      map_status_to_stage: {
        Args: { _status: string }
        Returns: Database["public"]["Enums"]["deal_stage"]
      }
      normalize_insurance_type: { Args: { _input: string }; Returns: string }
      reassign_pending_leads: { Args: never; Returns: number }
      supprimer_deal_manuel: { Args: { p_deal_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "owner"
      deal_stage:
        | "lead"
        | "qualified"
        | "quote_sent"
        | "subscription"
        | "incomplete"
        | "won"
        | "lost"
      doc_status: "manquant" | "attente" | "valide"
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
      app_role: ["admin", "moderator", "user", "owner"],
      deal_stage: [
        "lead",
        "qualified",
        "quote_sent",
        "subscription",
        "incomplete",
        "won",
        "lost",
      ],
      doc_status: ["manquant", "attente", "valide"],
    },
  },
} as const
