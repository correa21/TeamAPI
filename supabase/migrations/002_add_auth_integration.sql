-- Add auth_user_id column to link players with Supabase Auth users
ALTER TABLE player ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_player_auth_user ON player(auth_user_id);

-- Make email unique constraint work with auth
-- Update existing constraint if needed
ALTER TABLE player DROP CONSTRAINT IF EXISTS player_email_key;
ALTER TABLE player ADD CONSTRAINT player_email_key UNIQUE (email);

-- Make auth_user_id nullable for existing players, but required for new registrations
-- This allows backward compatibility
