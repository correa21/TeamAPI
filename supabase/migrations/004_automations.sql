-- ==========================================
-- 4. AUTOMATION TRIGGERS
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
