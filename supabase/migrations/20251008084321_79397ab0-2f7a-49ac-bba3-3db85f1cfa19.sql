-- Restructure riddles table to support room-based escape game
DROP TABLE IF EXISTS public.riddles CASCADE;

CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  theme text NOT NULL,
  code_reward text,
  order_index integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.puzzles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  puzzle_type text NOT NULL, -- 'captcha', '7differences', 'tiktok', 'corrupt', 'video-timecode', 'color-game', 'final-button'
  puzzle_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  answer text,
  hint text,
  order_index integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Rooms are viewable by everyone"
  ON public.rooms FOR SELECT
  USING (true);

-- Policies for puzzles
CREATE POLICY "Puzzles are viewable by everyone"
  ON public.puzzles FOR SELECT
  USING (true);

-- Insert rooms
INSERT INTO public.rooms (room_number, title, description, theme, code_reward, order_index) VALUES
(1, 'La Ferme TikTok', 'Sabotez la production de vidéos virales en perturbant leur système', 'tiktok-farm', '2847', 1),
(2, 'Les Scènes Fake', 'Détruisez les faux décors et sabotez leurs enregistrements', 'fake-scenes', '9153', 2),
(3, 'Salle des Monteurs', 'Corrompez les monteurs et sabotez leur équipement', 'editors-room', '6294', 3),
(4, 'Salle du Bouton Rouge', 'Utilisez les 3 codes pour accéder à la salle finale et faire tout exploser', 'final-room', null, 4);

-- Insert puzzles for Room 1 (La Ferme TikTok)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Captcha de Sécurité', 'Résolvez le captcha pour accéder au téléphone des influenceurs', 'captcha', 
'{"captcha_text": "7K9P2M", "difficulty": "medium"}'::jsonb, '7K9P2M', 'Les lettres et chiffres sont en majuscules', 1
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Sabotage des Hashtags', 'Remplacez les hashtags tendance par des hashtags absurdes', 'tiktok', 
'{"original_hashtags": ["#voyage", "#vacances", "#paradise"], "sabotage_hashtags": ["#enfer", "#pluie", "#cauchemar"]}'::jsonb, 'correct', 'Trouvez les hashtags qui ruineront leur viralité', 2
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Jeu des 7 Différences', 'Trouvez les 7 différences entre la vraie salle 1 et la fausse scène de la salle 2', '7differences', 
'{"differences_count": 7}'::jsonb, '7', 'Comparez attentivement les deux scènes', 3
FROM public.rooms WHERE room_number = 1;

-- Insert puzzles for Room 2 (Les Scènes Fake)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Alarme Incendie', 'Déclenchez l''alarme incendie pour faire sortir tout le monde de la salle', 'action', 
'{"action_type": "fire_alarm"}'::jsonb, 'triggered', 'Cherchez le boîtier rouge sur le mur', 1
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Jeu de Couleurs', 'Ajustez les lumières du fond vert pour ruiner l''éclairage parfait', 'color-game', 
'{"target_color": "#FF0000", "current_color": "#00FF00"}'::jsonb, 'rouge', 'La couleur opposée au vert...', 2
FROM public.rooms WHERE room_number = 2;

-- Insert puzzles for Room 3 (Salle des Monteurs)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Corrompre le Monteur', 'Choisissez comment corrompre le monteur pour qu''il abandonne son poste', 'corrupt', 
'{"options": ["argent", "otage", "licence"]}'::jsonb, 'argent', 'L''argent est le plus simple', 1
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Code Timecode', 'Mettez la vidéo en pause au bon moment pour révéler le mot de passe', 'video-timecode', 
'{"correct_time": "01:23", "password": "PARADISE2024"}'::jsonb, '01:23', 'Regardez attentivement entre 1:20 et 1:25', 2
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Saboter le Matériel', 'Renversez de l''eau sur le clavier pour détruire le poste de travail', 'action', 
'{"action_type": "spill_water"}'::jsonb, 'destroyed', 'Le verre d''eau est juste à côté du clavier', 3
FROM public.rooms WHERE room_number = 3;

-- Insert puzzle for Room 4 (Final Room)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Le Bouton Rouge Final', 'Spammez le bouton rouge pour déclencher le compte à rebours de l''explosion', 'final-button', 
'{"clicks_required": 50, "countdown_duration": 10}'::jsonb, 'exploded', 'Cliquez aussi vite que possible !', 1
FROM public.rooms WHERE room_number = 4;

-- Update lobbies table to use new structure
ALTER TABLE public.lobbies DROP COLUMN IF EXISTS current_riddle;
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS current_room integer DEFAULT 1;
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS collected_codes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS completed_puzzles jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS hints_used integer DEFAULT 0;
ALTER TABLE public.lobbies ADD COLUMN IF NOT EXISTS last_hint_time timestamp with time zone;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.puzzles;