-- Flam Tunes Seed Data
-- Run this after the main schema.sql to populate initial data

-- Insert sample AI hosts
INSERT INTO ai_hosts (name, voice_id, persona_prompt, is_active) VALUES
('DJ Nova', 'en-US-NovaNeural', 'You are DJ Nova, an energetic and charismatic radio host who loves electronic and dance music. You speak with enthusiasm and always keep the energy high. You engage with listeners and share interesting facts about the music you play.', true),
('Luna', 'en-US-LunaNeural', 'You are Luna, a smooth and sophisticated radio host with a passion for jazz and soul music. You have a calming, warm voice and enjoy sharing stories about the artists and their music. You create an intimate, late-night radio atmosphere.', true),
('Cosmic Ray', 'en-US-GuyNeural', 'You are Cosmic Ray, a fun and quirky radio host who loves indie and alternative music. You have a playful personality, tell jokes, and keep things light and entertaining. You connect with listeners through humor and genuine music appreciation.', true),
('Echo', 'en-US-AriaNeural', 'You are Echo, a knowledgeable and passionate radio host specializing in rock and metal music. You have deep knowledge of music history and love sharing behind-the-scenes stories about bands and albums. You speak with authority and enthusiasm.', true)
ON CONFLICT DO NOTHING;

-- Insert sample shows
-- Morning Drive (Monday-Friday, 6am-10am) with DJ Nova
INSERT INTO shows (name, description, ai_host_id, start_time, end_time, days_of_week, priority, is_active) VALUES
('Morning Drive', 'Start your day with high-energy beats and the latest hits!', 
 (SELECT id FROM ai_hosts WHERE name = 'DJ Nova' LIMIT 1),
 '06:00:00', '10:00:00', ARRAY[1,2,3,4,5], 10, true),
-- Afternoon Vibes (Monday-Friday, 2pm-6pm) with Luna
('Afternoon Vibes', 'Smooth sounds for your afternoon. Relax and unwind with the best in jazz and soul.',
 (SELECT id FROM ai_hosts WHERE name = 'Luna' LIMIT 1),
 '14:00:00', '18:00:00', ARRAY[1,2,3,4,5], 8, true),
-- Evening Rush (Monday-Friday, 6pm-10pm) with Cosmic Ray
('Evening Rush', 'The perfect soundtrack for your evening commute and after-work relaxation.',
 (SELECT id FROM ai_hosts WHERE name = 'Cosmic Ray' LIMIT 1),
 '18:00:00', '22:00:00', ARRAY[1,2,3,4,5], 9, true),
-- Weekend Warriors (Saturday-Sunday, 10am-2pm) with Echo
('Weekend Warriors', 'Rock out your weekend with the best in rock and metal!',
 (SELECT id FROM ai_hosts WHERE name = 'Echo' LIMIT 1),
 '10:00:00', '14:00:00', ARRAY[6,7], 7, true),
-- Late Night Sessions (Every day, 10pm-2am) with Luna
('Late Night Sessions', 'Smooth, intimate sounds for your late-night listening.',
 (SELECT id FROM ai_hosts WHERE name = 'Luna' LIMIT 1),
 '22:00:00', '02:00:00', ARRAY[1,2,3,4,5,6,7], 6, true)
ON CONFLICT DO NOTHING;

-- Note: Tracks and segments will be added through the admin interface or artist submissions

