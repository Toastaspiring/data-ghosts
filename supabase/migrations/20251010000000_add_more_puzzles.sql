-- Add more puzzles to each room to reach 10 puzzles per room (3 minutes total per room)

-- Room 1 (La Ferme TikTok) - Adding 7 more puzzles (currently has 3)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Hack des Notifications', 'Désactivez toutes les notifications push pour frustrer les utilisateurs', 'action', 
'{"action_type": "disable_notifications"}'::jsonb, 'disabled', 'Cherchez les paramètres de notification', 4
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Code d''Accès Caméra', 'Trouvez le code pour accéder aux caméras de surveillance', 'captcha', 
'{"captcha_text": "2B8X9F", "difficulty": "medium"}'::jsonb, '2B8X9F', 'Format: Chiffre-Lettre-Chiffre-Lettre-Chiffre-Lettre', 5
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Algorithme de Recommandation', 'Modifiez l''algorithme pour promouvoir du contenu ennuyeux', 'algorithm', 
'{"variables": ["engagement", "trends", "boring"], "target": "minimize_engagement"}'::jsonb, 'boring', 'Choisissez l''option qui réduira l''engagement', 6
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Quiz Biodiversité Piège', 'Répondez au quiz environnemental en choisissant les pires réponses', 'biodiversity-quiz', 
'{"questions": 5, "trap_mode": true}'::jsonb, 'failed', 'Choisissez toujours la réponse la plus destructrice', 7
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Corruption des Filtres', 'Cassez tous les filtres de beauté pour révéler la réalité', 'action', 
'{"action_type": "break_filters"}'::jsonb, 'broken', 'Cliquez sur chaque filtre pour le casser', 8
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Sabotage Monétisation', 'Détruisez le système de monétisation des créateurs', 'action', 
'{"action_type": "destroy_monetization"}'::jsonb, 'destroyed', 'Trouvez le serveur de paiements et débranchez-le', 9
FROM public.rooms WHERE room_number = 1;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Redirection Malveillante', 'Redirigez tous les liens vers des sites éducatifs ennuyeux', 'action', 
'{"action_type": "redirect_links", "target": "educational_sites"}'::jsonb, 'redirected', 'Modifiez la table de routage', 10
FROM public.rooms WHERE room_number = 1;

-- Room 2 (Les Scènes Fake) - Adding 8 more puzzles (currently has 2)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Sabotage Éclairage Studio', 'Éteignez tous les projecteurs un par un', 'action', 
'{"action_type": "turn_off_lights", "light_count": 8}'::jsonb, 'darkness', 'Trouvez le panneau électrique principal', 3
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Destruction Fond Vert', 'Déchirez le fond vert pour ruiner les prises', 'action', 
'{"action_type": "tear_greenscreen"}'::jsonb, 'torn', 'Utilisez les ciseaux dans le tiroir', 4
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Code Régie Technique', 'Accédez à la régie pour couper le son', 'captcha', 
'{"captcha_text": "AUDIO1", "difficulty": "easy"}'::jsonb, 'AUDIO1', 'Le code est écrit sur la console de mixage', 5
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Piratage Prompteur', 'Remplacez le texte du prompteur par du charabia', 'action', 
'{"action_type": "hack_teleprompter"}'::jsonb, 'hacked', 'Accédez au logiciel de prompteur', 6
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Corruption Micro', 'Ajustez les fréquences pour créer des parasites', 'color-game', 
'{"target_frequency": "static", "current_frequency": "clean"}'::jsonb, 'static', 'Tournez tous les boutons à fond', 7
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Désordre Accessoires', 'Mélangez tous les accessoires de tournage', 'action', 
'{"action_type": "mess_props"}'::jsonb, 'chaos', 'Échangez les étiquettes des boîtes', 8
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Caméra en Panne', 'Simulez une panne sur toutes les caméras', 'action', 
'{"action_type": "break_cameras", "camera_count": 5}'::jsonb, 'offline', 'Débranchez discrètement les câbles', 9
FROM public.rooms WHERE room_number = 2;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Script Modifié', 'Réécrivez le script pour qu''il soit complètement absurde', 'action', 
'{"action_type": "rewrite_script"}'::jsonb, 'absurd', 'Remplacez tous les mots par des synonymes ridicules', 10
FROM public.rooms WHERE room_number = 2;

-- Room 3 (Salle des Monteurs) - Adding 7 more puzzles (currently has 3)
INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Effets Sonores Chaotiques', 'Mélangez tous les effets sonores dans la bibliothèque', 'action', 
'{"action_type": "mix_sound_effects"}'::jsonb, 'mixed', 'Glissez-déposez au hasard dans les dossiers', 4
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Timeline Corrompue', 'Mélangez l''ordre des séquences dans la timeline', 'action', 
'{"action_type": "shuffle_timeline"}'::jsonb, 'shuffled', 'Inversez l''ordre chronologique', 5
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Mot de Passe Rendu', 'Trouvez le mot de passe du serveur de rendu', 'video-timecode', 
'{"correct_time": "02:47", "password": "RENDER2024"}'::jsonb, '02:47', 'Le mot de passe apparaît brièvement dans la preview', 6
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Codec Incompatible', 'Changez tous les codecs pour des formats obsolètes', 'action', 
'{"action_type": "change_codecs"}'::jsonb, 'incompatible', 'Sélectionnez les codecs les plus anciens', 7
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Sauvegardes Supprimées', 'Supprimez toutes les sauvegardes automatiques', 'action', 
'{"action_type": "delete_backups"}'::jsonb, 'deleted', 'Videz la corbeille du système', 8
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Export Sabotage', 'Configurez l''export avec les pires paramètres possible', 'action', 
'{"action_type": "bad_export_settings"}'::jsonb, 'terrible', 'Baissez la qualité au minimum', 9
FROM public.rooms WHERE room_number = 3;

INSERT INTO public.puzzles (room_id, title, description, puzzle_type, puzzle_data, answer, hint, order_index)
SELECT id, 'Métadonnées Corrompues', 'Effacez toutes les métadonnées des fichiers vidéo', 'action', 
'{"action_type": "corrupt_metadata"}'::jsonb, 'corrupted', 'Utilisez l''outil de nettoyage métadonnées', 10
FROM public.rooms WHERE room_number = 3;