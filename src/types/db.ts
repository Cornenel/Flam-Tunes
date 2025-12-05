// Database types for Flam Tunes
// These match the Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      ai_hosts: {
        Row: {
          id: number;
          name: string;
          voice_id: string;
          persona_prompt: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          voice_id: string;
          persona_prompt: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          voice_id?: string;
          persona_prompt?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      shows: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          ai_host_id: number | null;
          start_time: string;
          end_time: string;
          days_of_week: number[];
          priority: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          ai_host_id?: number | null;
          start_time: string;
          end_time: string;
          days_of_week: number[];
          priority?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          ai_host_id?: number | null;
          start_time?: string;
          end_time?: string;
          days_of_week?: number[];
          priority?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      tracks: {
        Row: {
          id: number;
          storage_path: string;
          artist: string | null;
          title: string | null;
          genre: string | null;
          bpm: number | null;
          mood_tags: string[] | null;
          is_jingle: boolean;
          is_bed_music: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          storage_path: string;
          artist?: string | null;
          title?: string | null;
          genre?: string | null;
          bpm?: number | null;
          mood_tags?: string[] | null;
          is_jingle?: boolean;
          is_bed_music?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          storage_path?: string;
          artist?: string | null;
          title?: string | null;
          genre?: string | null;
          bpm?: number | null;
          mood_tags?: string[] | null;
          is_jingle?: boolean;
          is_bed_music?: boolean;
          created_at?: string;
        };
      };
      segments: {
        Row: {
          id: number;
          type: "AI_TALK" | "NEWS" | "WEATHER" | "AD";
          show_id: number | null;
          ai_host_id: number | null;
          storage_path: string;
          text_script: string;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          type: "AI_TALK" | "NEWS" | "WEATHER" | "AD";
          show_id?: number | null;
          ai_host_id?: number | null;
          storage_path: string;
          text_script: string;
          meta?: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          type?: "AI_TALK" | "NEWS" | "WEATHER" | "AD";
          show_id?: number | null;
          ai_host_id?: number | null;
          storage_path?: string;
          text_script?: string;
          meta?: Json;
          created_at?: string;
        };
      };
      now_playing_history: {
        Row: {
          id: number;
          started_at: string;
          ended_at: string | null;
          item_type: "TRACK" | "SEGMENT";
          track_id: number | null;
          segment_id: number | null;
          show_id: number | null;
          listeners_estimate: number | null;
        };
        Insert: {
          id?: number;
          started_at?: string;
          ended_at?: string | null;
          item_type: "TRACK" | "SEGMENT";
          track_id?: number | null;
          segment_id?: number | null;
          show_id?: number | null;
          listeners_estimate?: number | null;
        };
        Update: {
          id?: number;
          started_at?: string;
          ended_at?: string | null;
          item_type?: "TRACK" | "SEGMENT";
          track_id?: number | null;
          segment_id?: number | null;
          show_id?: number | null;
          listeners_estimate?: number | null;
        };
      };
      requests: {
        Row: {
          id: number;
          created_at: string;
          name: string | null;
          message: string;
          requested_track_id: number | null;
          status: "PENDING" | "QUEUED" | "PLAYED" | "REJECTED";
          handled_by: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name?: string | null;
          message: string;
          requested_track_id?: number | null;
          status?: "PENDING" | "QUEUED" | "PLAYED" | "REJECTED";
          handled_by?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string | null;
          message?: string;
          requested_track_id?: number | null;
          status?: "PENDING" | "QUEUED" | "PLAYED" | "REJECTED";
          handled_by?: string | null;
        };
      };
      artist_profiles: {
        Row: {
          id: number;
          user_id: string;
          artist_name: string;
          contact_name: string;
          contact_phone: string | null;
          bio: string | null;
          website: string | null;
          social_links: Json;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          artist_name: string;
          contact_name: string;
          contact_phone?: string | null;
          bio?: string | null;
          website?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          artist_name?: string;
          contact_name?: string;
          contact_phone?: string | null;
          bio?: string | null;
          website?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      artist_submissions: {
        Row: {
          id: number;
          created_at: string;
          artist_profile_id: number | null;
          artist_name: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          track_title: string;
          genre: string | null;
          release_date: string;
          bpm: number | null;
          mood_tags: string[] | null;
          storage_path: string;
          file_name: string;
          file_size: number | null;
          ownership_confirmed: boolean;
          permission_granted: boolean;
          rights_holder_name: string | null;
          additional_info: string | null;
          status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          reviewed_at: string | null;
          reviewed_by: string | null;
          admin_notes: string | null;
          approved_track_id: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          artist_profile_id?: number | null;
          artist_name: string;
          contact_name: string;
          contact_email: string;
          contact_phone?: string | null;
          track_title: string;
          genre?: string | null;
          release_date: string;
          bpm?: number | null;
          mood_tags?: string[] | null;
          storage_path: string;
          file_name: string;
          file_size?: number | null;
          ownership_confirmed: boolean;
          permission_granted: boolean;
          rights_holder_name?: string | null;
          additional_info?: string | null;
          status?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          admin_notes?: string | null;
          approved_track_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          artist_profile_id?: number | null;
          artist_name?: string;
          contact_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          track_title?: string;
          genre?: string | null;
          release_date?: string;
          bpm?: number | null;
          mood_tags?: string[] | null;
          storage_path?: string;
          file_name?: string;
          file_size?: number | null;
          ownership_confirmed?: boolean;
          permission_granted?: boolean;
          rights_holder_name?: string | null;
          additional_info?: string | null;
          status?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          admin_notes?: string | null;
          approved_track_id?: number | null;
        };
      };
    };
  };
}

// Convenience type aliases
export type AIHost = Database["public"]["Tables"]["ai_hosts"]["Row"];
export type Show = Database["public"]["Tables"]["shows"]["Row"];
export type Track = Database["public"]["Tables"]["tracks"]["Row"];
export type Segment = Database["public"]["Tables"]["segments"]["Row"];
export type NowPlayingHistory =
  Database["public"]["Tables"]["now_playing_history"]["Row"];
export type Request = Database["public"]["Tables"]["requests"]["Row"];
export type ArtistProfile =
  Database["public"]["Tables"]["artist_profiles"]["Row"];
export type ArtistSubmission =
  Database["public"]["Tables"]["artist_submissions"]["Row"];

// Extended types with joins
export interface NowPlayingWithDetails extends NowPlayingHistory {
  track?: Track | null;
  segment?: (Segment & { ai_host?: AIHost | null }) | null;
  show?: Show | null;
}

export interface ShowWithHost extends Show {
  ai_host?: AIHost | null;
}

export interface SegmentWithDetails extends Segment {
  ai_host?: AIHost | null;
  show?: Show | null;
}

export interface RequestWithTrack extends Request {
  requested_track?: Track | null;
}

export interface ArtistSubmissionWithTrack extends ArtistSubmission {
  approved_track?: Track | null;
  artist_profile?: ArtistProfile | null;
}

export interface ArtistProfileWithSubmissions extends ArtistProfile {
  submissions?: ArtistSubmission[];
}

