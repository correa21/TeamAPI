-- Team table
CREATE TABLE team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  region VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player table
CREATE TABLE player (
  id SERIAL PRIMARY KEY,
  team_id UUID REFERENCES team(id) ON DELETE CASCADE,
  player_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  curp VARCHAR(18) UNIQUE NOT NULL,
  short_size VARCHAR(10),
  jersey_size VARCHAR(10),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  federation_id INTEGER UNIQUE NOT NULL,
  eligibility BOOLEAN DEFAULT true,
  category VARCHAR(50),
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Number table
CREATE TABLE player_number (
  id SERIAL PRIMARY KEY,
  player_id INTEGER UNIQUE REFERENCES player(id) ON DELETE CASCADE,
  team_id UUID REFERENCES team(id) ON DELETE CASCADE,
  player_number INTEGER UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliations table
CREATE TABLE affiliations (
  id SERIAL PRIMARY KEY,
  player_id INTEGER UNIQUE REFERENCES player(id) ON DELETE CASCADE,
  federation BOOLEAN DEFAULT false,
  association BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  player_id INTEGER UNIQUE REFERENCES player(id) ON DELETE CASCADE,
  total_payed INTEGER DEFAULT 0,
  total_debt INTEGER DEFAULT 0,
  debt BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin table
CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  player_id INTEGER UNIQUE REFERENCES player(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Season table
CREATE TABLE season (
  id SERIAL PRIMARY KEY,
  modality VARCHAR(50) NOT NULL,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats table
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES player(id) ON DELETE CASCADE,
  season_id INTEGER REFERENCES season(id) ON DELETE CASCADE,
  yellow_card INTEGER DEFAULT 0,
  red_card INTEGER DEFAULT 0,
  try INTEGER DEFAULT 0,
  drop INTEGER DEFAULT 0,
  conversion INTEGER DEFAULT 0,
  penalty_scored INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_player_team ON player(team_id);
CREATE INDEX idx_player_number_player ON player_number(player_id);
CREATE INDEX idx_stats_player ON stats(player_id);
CREATE INDEX idx_stats_season ON stats(season_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_updated_at BEFORE UPDATE ON player FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_number_updated_at BEFORE UPDATE ON player_number FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_affiliations_updated_at BEFORE UPDATE ON affiliations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_season_updated_at BEFORE UPDATE ON season FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
