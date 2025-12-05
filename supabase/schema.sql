    -- Flam Tunes Database Schema
    -- Run this in your Supabase SQL Editor

    -- Enable UUID extension (if needed)
    -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Table: ai_hosts
    CREATE TABLE IF NOT EXISTS ai_hosts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    voice_id TEXT NOT NULL,
    persona_prompt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table: shows
    CREATE TABLE IF NOT EXISTS shows (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    ai_host_id BIGINT REFERENCES ai_hosts(id) ON DELETE SET NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week SMALLINT[] NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table: tracks
    CREATE TABLE IF NOT EXISTS tracks (
    id BIGSERIAL PRIMARY KEY,
    storage_path TEXT NOT NULL,
    artist TEXT,
    title TEXT,
    genre TEXT,
    bpm INTEGER,
    mood_tags TEXT[],
    is_jingle BOOLEAN DEFAULT false,
    is_bed_music BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table: segments
    CREATE TABLE IF NOT EXISTS segments (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('AI_TALK', 'NEWS', 'WEATHER', 'AD')),
    show_id BIGINT REFERENCES shows(id) ON DELETE SET NULL,
    ai_host_id BIGINT REFERENCES ai_hosts(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    text_script TEXT NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table: now_playing_history
    CREATE TABLE IF NOT EXISTS now_playing_history (
    id BIGSERIAL PRIMARY KEY,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    item_type TEXT NOT NULL CHECK (item_type IN ('TRACK', 'SEGMENT')),
    track_id BIGINT REFERENCES tracks(id) ON DELETE SET NULL,
    segment_id BIGINT REFERENCES segments(id) ON DELETE SET NULL,
    show_id BIGINT REFERENCES shows(id) ON DELETE SET NULL,
    listeners_estimate INTEGER
    );

    -- Table: requests
    CREATE TABLE IF NOT EXISTS requests (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    message TEXT NOT NULL,
    requested_track_id BIGINT REFERENCES tracks(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QUEUED', 'PLAYED', 'REJECTED')),
    handled_by TEXT
    );

    -- Table: artist_profiles
    -- Links to Supabase Auth users (auth.users)
    CREATE TABLE IF NOT EXISTS artist_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artist_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
    );

    -- Table: artist_submissions
    CREATE TABLE IF NOT EXISTS artist_submissions (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Link to artist profile
    artist_profile_id BIGINT REFERENCES artist_profiles(id) ON DELETE CASCADE,
    -- Artist/Contact Information (kept for backward compatibility and quick access)
    artist_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    -- Track Information
    track_title TEXT NOT NULL,
    genre TEXT,
    release_date DATE NOT NULL,
    bpm INTEGER,
    mood_tags TEXT[],
    -- File Information
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    -- Ownership & Permissions
    ownership_confirmed BOOLEAN NOT NULL DEFAULT false,
    permission_granted BOOLEAN NOT NULL DEFAULT false,
    rights_holder_name TEXT,
    additional_info TEXT,
    -- Review Status
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    admin_notes TEXT,
    -- If approved, link to tracks table
    approved_track_id BIGINT REFERENCES tracks(id) ON DELETE SET NULL
    );

    -- Create indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_shows_ai_host_id ON shows(ai_host_id);
    CREATE INDEX IF NOT EXISTS idx_shows_active ON shows(is_active);
    CREATE INDEX IF NOT EXISTS idx_segments_show_id ON segments(show_id);
    CREATE INDEX IF NOT EXISTS idx_segments_ai_host_id ON segments(ai_host_id);
    CREATE INDEX IF NOT EXISTS idx_now_playing_started_at ON now_playing_history(started_at DESC);
    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
    CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_artist_profiles_user_id ON artist_profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_artist_submissions_artist_profile_id ON artist_submissions(artist_profile_id);
    CREATE INDEX IF NOT EXISTS idx_artist_submissions_status ON artist_submissions(status);
    CREATE INDEX IF NOT EXISTS idx_artist_submissions_created_at ON artist_submissions(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_artist_submissions_contact_email ON artist_submissions(contact_email);

-- Row Level Security (RLS) policies
-- Enable RLS on all tables (safe to run multiple times)
DO $$ 
BEGIN
  ALTER TABLE ai_hosts ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE now_playing_history ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE artist_profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE artist_submissions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop existing policies if they exist, then create them
-- Public read access for public tables (for now playing, shows, etc.)
DROP POLICY IF EXISTS "Public read access for ai_hosts" ON ai_hosts;
CREATE POLICY "Public read access for ai_hosts" ON ai_hosts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for shows" ON shows;
CREATE POLICY "Public read access for shows" ON shows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for tracks" ON tracks;
CREATE POLICY "Public read access for tracks" ON tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for segments" ON segments;
CREATE POLICY "Public read access for segments" ON segments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for now_playing_history" ON now_playing_history;
CREATE POLICY "Public read access for now_playing_history" ON now_playing_history FOR SELECT USING (true);

-- Public insert access for requests
DROP POLICY IF EXISTS "Public insert access for requests" ON requests;
CREATE POLICY "Public insert access for requests" ON requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access for requests" ON requests;
CREATE POLICY "Public read access for requests" ON requests FOR SELECT USING (true);

-- Artist profiles policies
-- Artists can read and update their own profile
DROP POLICY IF EXISTS "Artists can read own profile" ON artist_profiles;
CREATE POLICY "Artists can read own profile" ON artist_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Artists can update own profile" ON artist_profiles;
CREATE POLICY "Artists can update own profile" ON artist_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Public can read artist profiles (for display purposes)
DROP POLICY IF EXISTS "Public read artist profiles" ON artist_profiles;
CREATE POLICY "Public read artist profiles" ON artist_profiles FOR SELECT USING (true);

-- Artist submissions policies
-- Artists can insert their own submissions
DROP POLICY IF EXISTS "Artists can insert own submissions" ON artist_submissions;
CREATE POLICY "Artists can insert own submissions" ON artist_submissions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM artist_profiles 
    WHERE artist_profiles.user_id = auth.uid() 
    AND artist_profiles.id = artist_submissions.artist_profile_id
  )
);

-- Artists can read their own submissions
DROP POLICY IF EXISTS "Artists can read own submissions" ON artist_submissions;
CREATE POLICY "Artists can read own submissions" ON artist_submissions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM artist_profiles 
    WHERE artist_profiles.user_id = auth.uid() 
    AND artist_profiles.id = artist_submissions.artist_profile_id
  )
);

-- Public insert access (for backward compatibility - will be removed later)
DROP POLICY IF EXISTS "Public insert access for artist_submissions" ON artist_submissions;
CREATE POLICY "Public insert access for artist_submissions" ON artist_submissions FOR INSERT WITH CHECK (true);

-- Public read access (for backward compatibility)
DROP POLICY IF EXISTS "Public read own submissions" ON artist_submissions;
CREATE POLICY "Public read own submissions" ON artist_submissions FOR SELECT USING (true);

    -- Admin full access (requires authenticated user - adjust based on your auth setup)
    -- For now, we'll handle auth in the application layer
    -- You can add more granular policies later based on user roles

