-- ==========================================
-- 1. DATABASE SCHEMA SETUP
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1.1 TEAM TABLE
CREATE TABLE IF NOT EXISTS public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 PLAYER TABLE (Links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.player (
    id SERIAL PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Links to Login
    team_id UUID REFERENCES public.team(id),
    player_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    curp VARCHAR(50) UNIQUE NOT NULL, -- Extended to 50 chars for foreign players
    rfc VARCHAR(13), -- Registro Federal de Contribuyentes (Mexican Tax ID)
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255), -- Managed by App/Supabase, nullable for CSV imports
    federation_id INTEGER UNIQUE NOT NULL,
    short_size VARCHAR(10),
    jersey_size VARCHAR(10),
    eligibility BOOLEAN DEFAULT true,
    category VARCHAR(50),
    profile_picture TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 PLAYER NUMBER TABLE
CREATE TABLE IF NOT EXISTS public.player_number (
    id SERIAL PRIMARY KEY,
    player_id INTEGER UNIQUE REFERENCES public.player(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.team(id),
    player_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, player_number) -- Prevent duplicate numbers per team
);

-- 1.4 AFFILIATIONS TABLE
CREATE TABLE IF NOT EXISTS public.affiliations (
    id SERIAL PRIMARY KEY,
    player_id INTEGER UNIQUE REFERENCES public.player(id) ON DELETE CASCADE,
    federation BOOLEAN DEFAULT false,
    association BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 PAYMENTS TABLE (Sensitive)
CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL PRIMARY KEY,
    player_id INTEGER UNIQUE REFERENCES public.player(id) ON DELETE CASCADE,
    total_payed INTEGER DEFAULT 0,
    total_debt INTEGER DEFAULT 0,
    debt BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.6 ADMIN TABLE (Roles)
CREATE TABLE IF NOT EXISTS public.admin (
    id SERIAL PRIMARY KEY,
    player_id INTEGER UNIQUE REFERENCES public.player(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.7 SEASON TABLE
CREATE TABLE IF NOT EXISTS public.season (
    id SERIAL PRIMARY KEY,
    modality VARCHAR(50) NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure is_current column exists (if table already existed without it)
ALTER TABLE public.season ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT false;

-- 1.8 STATS TABLE
CREATE TABLE IF NOT EXISTS public.stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES public.player(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.season(id) ON DELETE CASCADE,
    yellow_card INTEGER DEFAULT 0,
    red_card INTEGER DEFAULT 0,
    try INTEGER DEFAULT 0,
    drop_goal INTEGER DEFAULT 0,
    conversion INTEGER DEFAULT 0,
    penalty_scored INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. AUTOMATIC TIMESTAMP TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_team_time ON public.team;
CREATE TRIGGER update_team_time BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_player_time ON public.player;
CREATE TRIGGER update_player_time BEFORE UPDATE ON public.player FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_time ON public.payments;
CREATE TRIGGER update_payment_time BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_time ON public.admin;
CREATE TRIGGER update_admin_time BEFORE UPDATE ON public.admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stats_time ON public.stats;
CREATE TRIGGER update_stats_time BEFORE UPDATE ON public.stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 3. SECURITY FUNCTIONS & RLS SETUP
-- ==========================================

-- 3.1 Helper Function: Check if User is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin a
    JOIN public.player p ON a.player_id = p.id
    WHERE p.auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.2 Enable RLS on All Tables
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_number ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS POLICIES
-- ==========================================

-- 4.1 Payments (Sensitive)
DROP POLICY IF EXISTS "Payments: View own or Admin" ON public.payments;
CREATE POLICY "Payments: View own or Admin" ON public.payments 
FOR SELECT USING (
  (SELECT auth_user_id FROM public.player WHERE id = payments.player_id) = auth.uid() 
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Payments: Admin write only" ON public.payments;
CREATE POLICY "Payments: Admin write only" ON public.payments 
FOR ALL USING (public.is_admin());

-- 4.2 Player Profile (PII Protected)
DROP POLICY IF EXISTS "Player: View own or Admin" ON public.player;
CREATE POLICY "Player: View own or Admin" ON public.player 
FOR SELECT USING (auth_user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Player: Update own or Admin" ON public.player;
CREATE POLICY "Player: Update own or Admin" ON public.player 
FOR UPDATE USING (auth_user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Player: Insert on Register" ON public.player;
CREATE POLICY "Player: Insert on Register" ON public.player 
FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- 4.3 Admin Table (Highly Sensitive)
DROP POLICY IF EXISTS "Admin: Read by Admins only" ON public.admin;
CREATE POLICY "Admin: Read by Admins only" ON public.admin 
FOR SELECT USING (public.is_admin());

-- 4.4 Public Read Data (Stats, Teams, Seasons)
-- Teams
DROP POLICY IF EXISTS "Teams: Public read" ON public.team;
CREATE POLICY "Teams: Public read" ON public.team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teams: Admin write" ON public.team;
CREATE POLICY "Teams: Admin write" ON public.team FOR ALL USING (public.is_admin());

-- Seasons
DROP POLICY IF EXISTS "Seasons: Public read" ON public.season;
CREATE POLICY "Seasons: Public read" ON public.season FOR SELECT USING (true);

DROP POLICY IF EXISTS "Seasons: Admin write" ON public.season;
CREATE POLICY "Seasons: Admin write" ON public.season FOR ALL USING (public.is_admin());

-- Stats
DROP POLICY IF EXISTS "Stats: Public read" ON public.stats;
CREATE POLICY "Stats: Public read" ON public.stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Stats: Admin write" ON public.stats;
CREATE POLICY "Stats: Admin write" ON public.stats FOR ALL USING (public.is_admin());

-- Player Numbers
DROP POLICY IF EXISTS "Numbers: Public read" ON public.player_number;
CREATE POLICY "Numbers: Public read" ON public.player_number FOR SELECT USING (true);

DROP POLICY IF EXISTS "Numbers: Admin write" ON public.player_number;
CREATE POLICY "Numbers: Admin write" ON public.player_number FOR ALL USING (public.is_admin());

-- Affiliations
DROP POLICY IF EXISTS "Affiliations: Public read" ON public.affiliations;
CREATE POLICY "Affiliations: Public read" ON public.affiliations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Affiliations: Admin write" ON public.affiliations;
CREATE POLICY "Affiliations: Admin write" ON public.affiliations FOR ALL USING (public.is_admin());

-- ==========================================
-- 5. PUBLIC VIEWS
-- ==========================================

-- 5.1 Roster View (Safe public data without PII)
CREATE OR REPLACE VIEW public.roster_view AS
SELECT 
  p.id as player_id,
  p.team_id,
  p.player_name,
  p.category,
  p.profile_picture,
  p.short_size,
  p.jersey_size,
  pn.player_number,
  t.name as team_name
FROM public.player p
LEFT JOIN public.player_number pn ON p.id = pn.player_id
LEFT JOIN public.team t ON p.team_id = t.id
WHERE p.eligibility = true;

-- Grant access to public (anon) and logged in users
GRANT SELECT ON public.roster_view TO anon, authenticated;

-- ==========================================
-- 6. AUTOMATION TRIGGERS
-- ==========================================

-- Function to handle new player creation
CREATE OR REPLACE FUNCTION public.handle_new_player()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default Payment record
  INSERT INTO public.payments (player_id, total_payed, total_debt, debt)
  VALUES (NEW.id, 0, 0, false);

  -- Create default Affiliation record
  INSERT INTO public.affiliations (player_id, federation, association)
  VALUES (NEW.id, false, false);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: After Player Created
DROP TRIGGER IF EXISTS on_player_created ON public.player;
CREATE TRIGGER on_player_created
  AFTER INSERT ON public.player
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_player();

-- ==========================================
-- 7. SEASON AUTOMATION
-- ==========================================

-- 7.1 Function to handle current season logic
CREATE OR REPLACE FUNCTION public.handle_current_season()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated season is marked as current
  IF NEW.is_current = true THEN
    -- Set all OTHER seasons to not current
    UPDATE public.season
    SET is_current = false
    WHERE id != NEW.id AND is_current = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.2 Trigger: Before Insert or Update on Season
DROP TRIGGER IF EXISTS on_season_current_change ON public.season;
CREATE TRIGGER on_season_current_change
  BEFORE INSERT OR UPDATE ON public.season
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION public.handle_current_season();