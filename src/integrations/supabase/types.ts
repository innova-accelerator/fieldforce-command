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
      activities: {
        Row: {
          associate_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          job_id: string | null
          timestamp: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          associate_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          timestamp?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          associate_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          timestamp?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_associate_id_fkey"
            columns: ["associate_id"]
            isOneToOne: false
            referencedRelation: "associates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      associates: {
        Row: {
          availability: string | null
          certifications: string[] | null
          completed_jobs: number | null
          created_at: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          joined_at: string | null
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          name: string
          phone: string | null
          rating: number | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          certifications?: string[] | null
          completed_jobs?: number | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          joined_at?: string | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          phone?: string | null
          rating?: number | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          certifications?: string[] | null
          completed_jobs?: number | null
          created_at?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          joined_at?: string | null
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          phone?: string | null
          rating?: number | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          total_jobs: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          assigned_person_id: string | null
          assigned_techs: string[] | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          estimated_duration: number | null
          id: string
          is_favorite: boolean | null
          location: string | null
          name: string
          notes: string[] | null
          organization_id: string | null
          phase: string | null
          priority: string | null
          scheduled_date: string | null
          start_date: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_techs?: string[] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          is_favorite?: boolean | null
          location?: string | null
          name: string
          notes?: string[] | null
          organization_id?: string | null
          phase?: string | null
          priority?: string | null
          scheduled_date?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_person_id?: string | null
          assigned_techs?: string[] | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          is_favorite?: boolean | null
          location?: string | null
          name?: string
          notes?: string[] | null
          organization_id?: string | null
          phase?: string | null
          priority?: string | null
          scheduled_date?: string | null
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_person_id_fkey"
            columns: ["assigned_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          additional_info: string | null
          address: string | null
          category: string | null
          city: string | null
          created_at: string | null
          email: string | null
          facebook: string | null
          id: string
          linkedin: string | null
          name: string
          phone: string | null
          relation: string | null
          state: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          zipcode: string | null
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          linkedin?: string | null
          name: string
          phone?: string | null
          relation?: string | null
          state?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          zipcode?: string | null
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          linkedin?: string | null
          name?: string
          phone?: string | null
          relation?: string | null
          state?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      people: {
        Row: {
          additional_info: string | null
          address: string | null
          birthday: string | null
          cell_number: string | null
          city: string | null
          created_at: string | null
          email: string | null
          facebook: string | null
          first_name: string
          id: string
          last_name: string
          linkedin: string | null
          office_number: string | null
          organization_id: string | null
          phone_alt: string | null
          state: string | null
          title: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string
          zipcode: string | null
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          birthday?: string | null
          cell_number?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          first_name: string
          id?: string
          last_name: string
          linkedin?: string | null
          office_number?: string | null
          organization_id?: string | null
          phone_alt?: string | null
          state?: string | null
          title?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id: string
          zipcode?: string | null
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          birthday?: string | null
          cell_number?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          facebook?: string | null
          first_name?: string
          id?: string
          last_name?: string
          linkedin?: string | null
          office_number?: string | null
          organization_id?: string | null
          phone_alt?: string | null
          state?: string | null
          title?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          complete: boolean | null
          created_at: string | null
          due_date: string | null
          id: string
          job_id: string
          label: string
          priority: string | null
          updated_at: string | null
        }
        Insert: {
          complete?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          job_id: string
          label: string
          priority?: string | null
          updated_at?: string | null
        }
        Update: {
          complete?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          job_id?: string
          label?: string
          priority?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_entries: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          job_id: string
          timestamp: string | null
          type: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          job_id: string
          timestamp?: string | null
          type: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          job_id?: string
          timestamp?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      activity_type: "note" | "call" | "email" | "job_completed" | "job_created"
      associate_availability: "available" | "busy" | "offline"
      customer_status: "active" | "inactive"
      job_priority: "Low" | "Medium" | "High" | "Urgent"
      job_status:
        | "New"
        | "Scheduled"
        | "In Progress"
        | "Completed"
        | "Cancelled"
      organization_relation: "Unknown" | "Vendor" | "Partner" | "Other"
      timeline_type: "note" | "status" | "assignment" | "scheduling"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: ["note", "call", "email", "job_completed", "job_created"],
      associate_availability: ["available", "busy", "offline"],
      customer_status: ["active", "inactive"],
      job_priority: ["Low", "Medium", "High", "Urgent"],
      job_status: ["New", "Scheduled", "In Progress", "Completed", "Cancelled"],
      organization_relation: ["Unknown", "Vendor", "Partner", "Other"],
      timeline_type: ["note", "status", "assignment", "scheduling"],
    },
  },
} as const
