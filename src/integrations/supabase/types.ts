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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aprendizados: {
        Row: {
          avatar_id: string | null
          campanha_id: string | null
          categoria: string
          created_at: string
          detalhe: string | null
          evidencia: Json | null
          formato: string | null
          id: string
          nicho: string | null
          peso: number | null
          produto_id: string | null
          titulo: string
        }
        Insert: {
          avatar_id?: string | null
          campanha_id?: string | null
          categoria: string
          created_at?: string
          detalhe?: string | null
          evidencia?: Json | null
          formato?: string | null
          id?: string
          nicho?: string | null
          peso?: number | null
          produto_id?: string | null
          titulo: string
        }
        Update: {
          avatar_id?: string | null
          campanha_id?: string | null
          categoria?: string
          created_at?: string
          detalhe?: string | null
          evidencia?: Json | null
          formato?: string | null
          id?: string
          nicho?: string | null
          peso?: number | null
          produto_id?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "aprendizados_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aprendizados_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      automacoes: {
        Row: {
          acao: string
          ativo: boolean
          config: Json | null
          created_at: string
          id: string
          trigger: string
          updated_at: string
        }
        Insert: {
          acao: string
          ativo?: boolean
          config?: Json | null
          created_at?: string
          id?: string
          trigger: string
          updated_at?: string
        }
        Update: {
          acao?: string
          ativo?: boolean
          config?: Json | null
          created_at?: string
          id?: string
          trigger?: string
          updated_at?: string
        }
        Relationships: []
      }
      avatar_fotos: {
        Row: {
          avatar_id: string
          created_at: string
          id: string
          ordem: number | null
          posicao: string
          storage_path: string | null
          url: string | null
        }
        Insert: {
          avatar_id: string
          created_at?: string
          id?: string
          ordem?: number | null
          posicao: string
          storage_path?: string | null
          url?: string | null
        }
        Update: {
          avatar_id?: string
          created_at?: string
          id?: string
          ordem?: number | null
          posicao?: string
          storage_path?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_fotos_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatares"
            referencedColumns: ["id"]
          },
        ]
      }
      avatares: {
        Row: {
          created_at: string
          descricao: string | null
          estilo: string | null
          genero: string | null
          id: string
          idade_estimada: string | null
          nichos: string[] | null
          nome: string
          origem: string
          pais: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          estilo?: string | null
          genero?: string | null
          id?: string
          idade_estimada?: string | null
          nichos?: string[] | null
          nome: string
          origem?: string
          pais?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          estilo?: string | null
          genero?: string | null
          id?: string
          idade_estimada?: string | null
          nichos?: string[] | null
          nome?: string
          origem?: string
          pais?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conectores_api: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          nome: string
          perfil_id: string | null
          secret_name: string | null
          status: string
          tipo: string
          ultima_sync: string | null
          ultimo_erro: string | null
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          nome: string
          perfil_id?: string | null
          secret_name?: string | null
          status?: string
          tipo: string
          ultima_sync?: string | null
          ultimo_erro?: string | null
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          nome?: string
          perfil_id?: string | null
          secret_name?: string | null
          status?: string
          tipo?: string
          ultima_sync?: string | null
          ultimo_erro?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conectores_api_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      criativos: {
        Row: {
          arquivo_url: string | null
          avatar_id: string | null
          classificacao_comercial: string | null
          created_at: string
          cta: string | null
          duracao_seg: number | null
          formato: string | null
          gancho: string | null
          gemini_account_id: string | null
          id: string
          legenda: string | null
          num_slides: number | null
          perfil_id: string | null
          produto_id: string | null
          roteiro: string | null
          status: string
          tipo: string
          titulo: string | null
          updated_at: string
          video_referencia_id: string | null
        }
        Insert: {
          arquivo_url?: string | null
          avatar_id?: string | null
          classificacao_comercial?: string | null
          created_at?: string
          cta?: string | null
          duracao_seg?: number | null
          formato?: string | null
          gancho?: string | null
          gemini_account_id?: string | null
          id?: string
          legenda?: string | null
          num_slides?: number | null
          perfil_id?: string | null
          produto_id?: string | null
          roteiro?: string | null
          status?: string
          tipo: string
          titulo?: string | null
          updated_at?: string
          video_referencia_id?: string | null
        }
        Update: {
          arquivo_url?: string | null
          avatar_id?: string | null
          classificacao_comercial?: string | null
          created_at?: string
          cta?: string | null
          duracao_seg?: number | null
          formato?: string | null
          gancho?: string | null
          gemini_account_id?: string | null
          id?: string
          legenda?: string | null
          num_slides?: number | null
          perfil_id?: string | null
          produto_id?: string | null
          roteiro?: string | null
          status?: string
          tipo?: string
          titulo?: string | null
          updated_at?: string
          video_referencia_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "criativos_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_gemini_account_id_fkey"
            columns: ["gemini_account_id"]
            isOneToOne: false
            referencedRelation: "gemini_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_video_referencia_id_fkey"
            columns: ["video_referencia_id"]
            isOneToOne: false
            referencedRelation: "videos_referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      custos: {
        Row: {
          campanha_id: string | null
          cliente_id: string | null
          cost_type: Database["public"]["Enums"]["cost_type"]
          created_at: string
          criativo_id: string | null
          currency: string
          id: string
          perfil_id: string | null
          provider_account_id: string | null
          provider_name: string
          quantity: number
          status: string
          total_cost: number
          unit_cost: number
        }
        Insert: {
          campanha_id?: string | null
          cliente_id?: string | null
          cost_type: Database["public"]["Enums"]["cost_type"]
          created_at?: string
          criativo_id?: string | null
          currency?: string
          id?: string
          perfil_id?: string | null
          provider_account_id?: string | null
          provider_name: string
          quantity?: number
          status?: string
          total_cost?: number
          unit_cost?: number
        }
        Update: {
          campanha_id?: string | null
          cliente_id?: string | null
          cost_type?: Database["public"]["Enums"]["cost_type"]
          created_at?: string
          criativo_id?: string | null
          currency?: string
          id?: string
          perfil_id?: string | null
          provider_account_id?: string | null
          provider_name?: string
          quantity?: number
          status?: string
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_criativo_id_fkey"
            columns: ["criativo_id"]
            isOneToOne: false
            referencedRelation: "criativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_provider_account_id_fkey"
            columns: ["provider_account_id"]
            isOneToOne: false
            referencedRelation: "gemini_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      gemini_accounts: {
        Row: {
          alerta_pct: number | null
          api_key_masked: string
          api_key_secret_name: string | null
          created_at: string
          gcp_project: string | null
          id: string
          limite_diario: number | null
          nome: string
          orcamento: number | null
          prioridade: number
          status: string
          ultimo_erro: string | null
          ultimo_uso: string | null
          updated_at: string
          uso_estimado: number | null
          usos: string[] | null
        }
        Insert: {
          alerta_pct?: number | null
          api_key_masked: string
          api_key_secret_name?: string | null
          created_at?: string
          gcp_project?: string | null
          id?: string
          limite_diario?: number | null
          nome: string
          orcamento?: number | null
          prioridade?: number
          status?: string
          ultimo_erro?: string | null
          ultimo_uso?: string | null
          updated_at?: string
          uso_estimado?: number | null
          usos?: string[] | null
        }
        Update: {
          alerta_pct?: number | null
          api_key_masked?: string
          api_key_secret_name?: string | null
          created_at?: string
          gcp_project?: string | null
          id?: string
          limite_diario?: number | null
          nome?: string
          orcamento?: number | null
          prioridade?: number
          status?: string
          ultimo_erro?: string | null
          ultimo_uso?: string | null
          updated_at?: string
          uso_estimado?: number | null
          usos?: string[] | null
        }
        Relationships: []
      }
      metricas: {
        Row: {
          capturado_em: string
          cliques: number | null
          comentarios: number | null
          compartilhamentos: number | null
          id: string
          likes: number | null
          origem: string | null
          publicacao_id: string
          receita: number | null
          vendas: number | null
          views: number | null
        }
        Insert: {
          capturado_em?: string
          cliques?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          id?: string
          likes?: number | null
          origem?: string | null
          publicacao_id: string
          receita?: number | null
          vendas?: number | null
          views?: number | null
        }
        Update: {
          capturado_em?: string
          cliques?: number | null
          comentarios?: number | null
          compartilhamentos?: number | null
          id?: string
          likes?: number | null
          origem?: string | null
          publicacao_id?: string
          receita?: number | null
          vendas?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_publicacao_id_fkey"
            columns: ["publicacao_id"]
            isOneToOne: false
            referencedRelation: "publicacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          avatar_principal: string | null
          created_at: string
          descricao: string | null
          id: string
          nicho: string | null
          nome: string
          observacoes: string | null
          pais: string | null
          plataforma: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_principal?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nicho?: string | null
          nome: string
          observacoes?: string | null
          pais?: string | null
          plataforma?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_principal?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nicho?: string | null
          nome?: string
          observacoes?: string | null
          pais?: string | null
          plataforma?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          comissao_pct: number | null
          created_at: string
          id: string
          link_tiktok: string | null
          nicho: string | null
          nome: string
          observacoes: string | null
          pais: string | null
          perfil_id: string | null
          preco: number | null
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          comissao_pct?: number | null
          created_at?: string
          id?: string
          link_tiktok?: string | null
          nicho?: string | null
          nome: string
          observacoes?: string | null
          pais?: string | null
          perfil_id?: string | null
          preco?: number | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          comissao_pct?: number | null
          created_at?: string
          id?: string
          link_tiktok?: string | null
          nicho?: string | null
          nome?: string
          observacoes?: string | null
          pais?: string | null
          perfil_id?: string | null
          preco?: number | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      publicacoes: {
        Row: {
          created_at: string
          criativo_id: string
          id: string
          observacoes: string | null
          perfil_id: string | null
          publicado_em: string | null
          tiktok_url: string | null
          tiktok_video_id: string | null
        }
        Insert: {
          created_at?: string
          criativo_id: string
          id?: string
          observacoes?: string | null
          perfil_id?: string | null
          publicado_em?: string | null
          tiktok_url?: string | null
          tiktok_video_id?: string | null
        }
        Update: {
          created_at?: string
          criativo_id?: string
          id?: string
          observacoes?: string | null
          perfil_id?: string | null
          publicado_em?: string | null
          tiktok_url?: string | null
          tiktok_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicacoes_criativo_id_fkey"
            columns: ["criativo_id"]
            isOneToOne: false
            referencedRelation: "criativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicacoes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      videos_referencia: {
        Row: {
          avatar_id: string | null
          created_at: string
          duracao_seg: number | null
          estrutura: string | null
          gancho: string | null
          id: string
          observacoes: string | null
          perfil_id: string | null
          produto_id: string | null
          roteiro_adaptado: string | null
          status: string
          tipo_criativo: string
          transcricao: string | null
          updated_at: string
          url_tiktok: string
          views_estimadas: number | null
        }
        Insert: {
          avatar_id?: string | null
          created_at?: string
          duracao_seg?: number | null
          estrutura?: string | null
          gancho?: string | null
          id?: string
          observacoes?: string | null
          perfil_id?: string | null
          produto_id?: string | null
          roteiro_adaptado?: string | null
          status?: string
          tipo_criativo?: string
          transcricao?: string | null
          updated_at?: string
          url_tiktok: string
          views_estimadas?: number | null
        }
        Update: {
          avatar_id?: string | null
          created_at?: string
          duracao_seg?: number | null
          estrutura?: string | null
          gancho?: string | null
          id?: string
          observacoes?: string | null
          perfil_id?: string | null
          produto_id?: string | null
          roteiro_adaptado?: string | null
          status?: string
          tipo_criativo?: string
          transcricao?: string | null
          updated_at?: string
          url_tiktok?: string
          views_estimadas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_referencia_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_referencia_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_referencia_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cost_type:
        | "script_generation"
        | "image_generation"
        | "video_generation"
        | "carousel_generation"
        | "voice_generation"
        | "rendering"
        | "storage"
        | "transcription"
        | "analysis"
        | "retry"
        | "manual_review"
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
      cost_type: [
        "script_generation",
        "image_generation",
        "video_generation",
        "carousel_generation",
        "voice_generation",
        "rendering",
        "storage",
        "transcription",
        "analysis",
        "retry",
        "manual_review",
      ],
    },
  },
} as const
