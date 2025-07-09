import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
        };
        Update: {
          email?: string;
          name?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          progress?: number;
        };
        Update: {
          name?: string;
          color?: string;
          progress?: number;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          completed: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          completed?: boolean;
          order: number;
        };
        Update: {
          title?: string;
          completed?: boolean;
          order?: number;
          updated_at?: string;
        };
      };
      timer_sessions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          duration: number;
          completed: boolean;
          start_time: string;
          end_time?: string;
          subject_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          duration: number;
          completed?: boolean;
          start_time: string;
          end_time?: string;
          subject_id?: string;
        };
        Update: {
          completed?: boolean;
          end_time?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          focus_time: number;
          short_break: number;
          long_break: number;
          auto_start: boolean;
          sound_enabled: boolean;
          fullscreen_mode: boolean;
          notification_sound: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          focus_time?: number;
          short_break?: number;
          long_break?: number;
          auto_start?: boolean;
          sound_enabled?: boolean;
          fullscreen_mode?: boolean;
          notification_sound?: string;
        };
        Update: {
          focus_time?: number;
          short_break?: number;
          long_break?: number;
          auto_start?: boolean;
          sound_enabled?: boolean;
          fullscreen_mode?: boolean;
          notification_sound?: string;
          updated_at?: string;
        };
      };
    };
  };
}