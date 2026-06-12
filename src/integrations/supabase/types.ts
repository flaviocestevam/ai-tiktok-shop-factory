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
            foreignKeyName: "aprendizados_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
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
      aprovacoes: {
        Row: {
          created_at: string
          decidido_em: string | null
          decidido_por: string | null
          entidade_id: string
          entidade_tipo: string
          etapa: string
          id: string
          observacao: string | null
          status: string
        }
        Insert: {
          created_at?: string
          decidido_em?: string | null
          decidido_por?: string | null
          entidade_id: string
          entidade_tipo: string
          etapa: string
          id?: string
          observacao?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          decidido_em?: string | null
          decidido_por?: string | null
          entidade_id?: string
          entidade_tipo?: string
          etapa?: string
          id?: string
          observacao?: string | null
          status?: string
        }
        Relationships: []
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
      campanhas: {
        Row: {
          avatar_id: string | null
          cliente_id: string | null
          created_at: string
          formatos: Json | null
          id: string
          nicho: string | null
          nome: string
          objetivo: string | null
          observacoes: string | null
          pais: string | null
          perfil_id: string | null
          produto_id: string | null
          qtd_carrosseis: number | null
          qtd_videos: number | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          avatar_id?: string | null
          cliente_id?: string | null
          created_at?: string
          formatos?: Json | null
          id?: string
          nicho?: string | null
          nome: string
          objetivo?: string | null
          observacoes?: string | null
          pais?: string | null
          perfil_id?: string | null
          produto_id?: string | null
          qtd_carrosseis?: number | null
          qtd_videos?: number | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          avatar_id?: string | null
          cliente_id?: string | null
          created_at?: string
          formatos?: Json | null
          id?: string
          nicho?: string | null
          nome?: string
          objetivo?: string | null
          observacoes?: string | null
          pais?: string | null
          perfil_id?: string | null
          produto_id?: string | null
          qtd_carrosseis?: number | null
          qtd_videos?: number | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campanhas_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campanhas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          carrosseis_contratados: number | null
          contato_email: string | null
          contato_nome: string | null
          contato_whatsapp: string | null
          created_at: string
          empresa: string
          id: string
          nicho: string | null
          observacoes: string | null
          pais: string | null
          plano_mensal: number | null
          status: string
          updated_at: string
          videos_contratados: number | null
        }
        Insert: {
          carrosseis_contratados?: number | null
          contato_email?: string | null
          contato_nome?: string | null
          contato_whatsapp?: string | null
          created_at?: string
          empresa: string
          id?: string
          nicho?: string | null
          observacoes?: string | null
          pais?: string | null
          plano_mensal?: number | null
          status?: string
          updated_at?: string
          videos_contratados?: number | null
        }
        Update: {
          carrosseis_contratados?: number | null
          contato_email?: string | null
          contato_nome?: string | null
          contato_whatsapp?: string | null
          created_at?: string
          empresa?: string
          id?: string
          nicho?: string | null
          observacoes?: string | null
          pais?: string | null
          plano_mensal?: number | null
          status?: string
          updated_at?: string
          videos_contratados?: number | null
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
          campanha_id: string | null
          classificacao_comercial: string | null
          cliente_id: string | null
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
        }
        Insert: {
          arquivo_url?: string | null
          avatar_id?: string | null
          campanha_id?: string | null
          classificacao_comercial?: string | null
          cliente_id?: string | null
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
        }
        Update: {
          arquivo_url?: string | null
          avatar_id?: string | null
          campanha_id?: string | null
          classificacao_comercial?: string | null
          cliente_id?: string | null
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
            foreignKeyName: "criativos_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
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
            foreignKeyName: "custos_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
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
      entregas: {
        Row: {
          campanha_id: string | null
          cliente_id: string
          created_at: string
          custo_total: number | null
          data_entrega: string | null
          id: string
          lucro: number | null
          margem: number | null
          observacoes: string | null
          pacote_url: string | null
          produto_id: string | null
          qtd_carrosseis: number | null
          qtd_total: number | null
          qtd_videos: number | null
          receita: number | null
          relatorio_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campanha_id?: string | null
          cliente_id: string
          created_at?: string
          custo_total?: number | null
          data_entrega?: string | null
          id?: string
          lucro?: number | null
          margem?: number | null
          observacoes?: string | null
          pacote_url?: string | null
          produto_id?: string | null
          qtd_carrosseis?: number | null
          qtd_total?: number | null
          qtd_videos?: number | null
          receita?: number | null
          relatorio_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campanha_id?: string | null
          cliente_id?: string
          created_at?: string
          custo_total?: number | null
          data_entrega?: string | null
          id?: string
          lucro?: number | null
          margem?: number | null
          observacoes?: string | null
          pacote_url?: string | null
          produto_id?: string | null
          qtd_carrosseis?: number | null
          qtd_total?: number | null
          qtd_videos?: number | null
          receita?: number | null
          relatorio_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_campanha_id_fkey"
            columns: ["campanha_id"]
            isOneToOne: false
            referencedRelation: "campanhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
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
          cliente_id: string | null
          comissao_pct: number | null
          created_at: string
          dor: string | null
          facilidade_visual: number | null
          id: string
          link_tiktok: string | null
          nicho: string | null
          nome: string
          observacoes: string | null
          oferta: string | null
          pais: string | null
          perfil_id: string | null
          preco: number | null
          publico: string | null
          recomendacao_tipo: string | null
          score: number | null
          status: string
          tem_antes_depois: boolean | null
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          comissao_pct?: number | null
          created_at?: string
          dor?: string | null
          facilidade_visual?: number | null
          id?: string
          link_tiktok?: string | null
          nicho?: string | null
          nome: string
          observacoes?: string | null
          oferta?: string | null
          pais?: string | null
          perfil_id?: string | null
          preco?: number | null
          publico?: string | null
          recomendacao_tipo?: string | null
          score?: number | null
          status?: string
          tem_antes_depois?: boolean | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          comissao_pct?: number | null
          created_at?: string
          dor?: string | null
          facilidade_visual?: number | null
          id?: string
          link_tiktok?: string | null
          nicho?: string | null
          nome?: string
          observacoes?: string | null
          oferta?: string | null
          pais?: string | null
          perfil_id?: string | null
          preco?: number | null
          publico?: string | null
          recomendacao_tipo?: string | null
          score?: number | null
          status?: string
          tem_antes_depois?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "operador"
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
      app_role: ["admin", "operador"],
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
