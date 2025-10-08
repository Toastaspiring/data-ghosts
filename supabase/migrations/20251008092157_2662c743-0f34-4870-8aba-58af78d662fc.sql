-- Phase 1: Add player assignments and parallel mode to lobbies
ALTER TABLE public.lobbies 
ADD COLUMN IF NOT EXISTS player_assignments jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS parallel_mode boolean DEFAULT true;

-- Phase 1: Add destination and token fields to rooms
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS destination_name text,
ADD COLUMN IF NOT EXISTS environmental_context jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS token_name text;

-- Phase 1: Update existing rooms with new destinations
UPDATE public.rooms 
SET 
  destination_name = 'Bali',
  token_name = 'TOKEN_BALI',
  environmental_context = jsonb_build_object(
    'threat', 'Surfréquentation touristique détruisant les écosystèmes de récifs coralliens',
    'impact', '70% des récifs endommagés',
    'goal', 'Saboter l''algorithme de promotion de Bali'
  )
WHERE room_number = 1;

UPDATE public.rooms 
SET 
  destination_name = 'Santorin',
  token_name = 'TOKEN_SANTORINI',
  environmental_context = jsonb_build_object(
    'threat', 'Érosion des falaises et pollution marine due au tourisme de masse',
    'impact', 'Capacité de charge dépassée de 300%',
    'goal', 'Déchiffrer le code de viralité de Santorin'
  )
WHERE room_number = 2;

UPDATE public.rooms 
SET 
  destination_name = 'Machu Picchu',
  token_name = 'TOKEN_MACHU',
  environmental_context = jsonb_build_object(
    'threat', 'Dégradation du site archéologique par piétinement excessif',
    'impact', '5000 visiteurs/jour au lieu de 2500 recommandés',
    'goal', 'Infiltrer le système de géolocalisation du Machu Picchu'
  )
WHERE room_number = 3;

UPDATE public.rooms 
SET 
  destination_name = 'Control Hub - Quartier Général',
  token_name = 'FINAL_SEQUENCE',
  environmental_context = jsonb_build_object(
    'threat', 'Publication imminente du post viral',
    'impact', 'Catastrophe environnementale mondiale',
    'goal', 'Désactiver l''algorithme de viralité d''Insta-Vibe'
  )
WHERE room_number = 4;