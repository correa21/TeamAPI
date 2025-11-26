-- ==========================================
-- 5. SEASON AUTOMATION
-- ==========================================

-- 5.1 Add is_current column to season table
ALTER TABLE public.season 
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT false;

-- 5.2 Function to handle current season logic
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

-- 5.3 Trigger: Before Insert or Update on Season
DROP TRIGGER IF EXISTS on_season_current_change ON public.season;
CREATE TRIGGER on_season_current_change
  BEFORE INSERT OR UPDATE ON public.season
  FOR EACH ROW
  WHEN (NEW.is_current = true)
  EXECUTE FUNCTION public.handle_current_season();
