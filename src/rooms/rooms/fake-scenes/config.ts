import { RoomConfig } from '../../core/types';

export const fakeScenesConfig: RoomConfig = {
  id: 'fake-scenes',
  name: 'Les Scènes Fake',
  description: 'Sabotez la production de vidéos en perturbant les faux décors et éclairages utilisés pour tromper les spectateurs.',
  
  theme: {
    primary: {
      neon: '#00FF41', // Matrix green
      glow: '#39FF14', // Neon green
      dark: '#001100'
    },
    environment: 'space',
    ambientSound: '/sounds/studio-ambient.mp3',
    backgroundMusic: '/sounds/cinematic-tension.mp3'
  },

  layout: {
    background: '/images/rooms/fake-scenes-bg.jpg',
    width: 1500,
    height: 1000,
    zones: [
      {
        id: 'green-screen-area',
        bounds: { x: 200, y: 150, w: 400, h: 300 },
        theme: 'greenscreen',
        interactive: true
      },
      {
        id: 'lighting-control',
        bounds: { x: 700, y: 100, w: 200, h: 150 },
        theme: 'lighting',
        interactive: true
      },
      {
        id: 'props-storage',
        bounds: { x: 100, y: 600, w: 300, h: 200 },
        theme: 'props',
        interactive: true
      },
      {
        id: 'meme-injection-station',
        bounds: { x: 1000, y: 400, w: 250, h: 180 },
        theme: 'digital',
        interactive: true
      },
      {
        id: 'comparison-screen',
        bounds: { x: 1200, y: 150, w: 200, h: 250 },
        theme: 'screen',
        interactive: true
      }
    ]
  },

  elements: [
    {
      id: 'green-screen-sabotage',
      type: 'equipment',
      name: 'Fond Vert à Saboter',
      description: 'Le fond vert utilisé pour les faux paysages. Plusieurs options de sabotage sont disponibles.',
      position: { x: 350, y: 250 },
      size: { width: 120, height: 200 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'background-disrupted',
            title: 'Fond Perturbé',
            description: 'Le système de fond vert est compromis - leurs faux paysages vont échouer.'
          }
        }
      ],
      isUnlocked: true, // Available from start if alarm triggered
      isSolved: false,
      puzzle: {
        id: 'sabotage-method-choice',
        type: 'logic',
        difficulty: 2,
        timeLimit: 300,
        component: 'SabotageChoicePuzzle',
        data: {
          methods: [
            {
              name: 'Brûler le fond vert',
              risk: 'high',
              effectiveness: 'high',
              stealth: 'low',
              consequence: 'Investigation policière'
            },
            {
              name: 'Être discret - couper l\'alimentation',
              risk: 'low',
              effectiveness: 'medium',
              stealth: 'high',
              consequence: 'Panne technique simple'
            },
            {
              name: 'Alarme incendie (déjà fait)',
              risk: 'medium',
              effectiveness: 'high',
              stealth: 'medium',
              consequence: 'Évacuation temporaire'
            },
            {
              name: 'Injecter des memes brainrot',
              risk: 'low',
              effectiveness: 'medium',
              stealth: 'high',
              consequence: 'Contenu ridicule'
            }
          ],
          optimal_choice: 'stealth'
        },
        validation: {
          type: 'custom',
          validator: (choice: number) => {
            // Choice 1 (cut power) is optimal - high stealth, low risk
            return choice === 1;
          }
        },
        hints: [
          'Pensez aux conséquences à long terme.',
          'La discrétion vous permettra de continuer votre mission.',
          'Évitez les méthodes qui attireraient la police.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['lighting-control-panel']
          }
        ]
      }
    },

    {
      id: 'lighting-control-panel',
      type: 'computer',
      name: 'Contrôle d\'Éclairage',
      description: 'Le panneau de contrôle des éclairages du studio. Manipulez les couleurs pour ruiner leurs prises.',
      position: { x: 750, y: 130 },
      size: { width: 100, height: 80 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'lighting-chaos',
            title: 'Chaos Lumineux',
            description: 'Les éclairages sont désynchronisés - leurs vidéos auront des couleurs horribles.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'color-lighting-game',
        type: 'pattern',
        difficulty: 3,
        timeLimit: 400,
        component: 'ColorGamePuzzle',
        data: {
          target_mood: 'romantic_sunset',
          available_lights: [
            { id: 'key_light', color: '#FFFFFF', intensity: 100, position: 'front' },
            { id: 'fill_light', color: '#FFE4B5', intensity: 80, position: 'side' },
            { id: 'back_light', color: '#87CEEB', intensity: 60, position: 'back' },
            { id: 'ambient_light', color: '#DDA0DD', intensity: 40, position: 'top' }
          ],
          sabotage_colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
          sabotage_goal: 'make_ugly'
        },
        validation: {
          type: 'custom',
          validator: (lightConfig: any) => {
            // Check if colors are completely wrong for romantic mood
            const ugliness_score = lightConfig.filter((light: any) => 
              ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF'].includes(light.color)
            ).length;
            return ugliness_score >= 3; // At least 3 ugly colors
          }
        },
        hints: [
          'Utilisez les couleurs les plus criardes possibles.',
          'Le vert et rouge ensemble créent un effet horrible.',
          'Plus c\'est flashy, mieux c\'est pour ruiner l\'ambiance.'
        ],
        rewards: [
          {
            type: 'crossRoom',
            targetRoom: 'tiktok-farm',
            clueData: {
              sourceRoom: 'fake-scenes',
              targetRoom: 'tiktok-farm',
              clueType: 'visual_style',
              value: 'ugly_lighting_setup',
              description: 'Configuration d\'éclairage horrible à utiliser pour la vidéo virale.'
            }
          },
          {
            type: 'unlock',
            elementIds: ['meme-injection']
          }
        ]
      }
    },

    {
      id: 'meme-injection',
      type: 'computer',
      name: 'Injection de Memes',
      description: 'Station pour injecter des memes brainrot dans leurs TikToks en cours de production.',
      position: { x: 1100, y: 480 },
      size: { width: 150, height: 100 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'brainrot-injected',
            title: 'Brainrot Injecté',
            description: 'Leurs vidéos sont maintenant remplies de memes Ohio Sigma - leur crédibilité est ruinée !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'meme-selection',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 250,
        component: 'MemePuzzle',
        data: {
          available_memes: [
            { name: 'Ohio', cringe_level: 9, viral_potential: 8 },
            { name: 'Sigma Male', cringe_level: 8, viral_potential: 7 },
            { name: 'Skibidi Toilet', cringe_level: 10, viral_potential: 9 },
            { name: 'Rizz', cringe_level: 7, viral_potential: 6 },
            { name: 'Among Us Sus', cringe_level: 6, viral_potential: 5 },
            { name: 'Big Chungus', cringe_level: 8, viral_potential: 4 }
          ],
          target_videos: 3,
          max_cringe_per_video: 25
        },
        validation: {
          type: 'custom',
          validator: (selection: any) => {
            // Check if total cringe is maximized
            const total_cringe = selection.reduce((sum: number, meme: any) => sum + meme.cringe_level, 0);
            return total_cringe >= 24; // High cringe threshold
          }
        },
        hints: [
          'Maximisez le niveau de cringe pour ruiner leur réputation.',
          'Skibidi Toilet est le meme le plus cringe disponible.',
          'Combinez plusieurs memes pour un effet optimal.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['scene-comparison']
          }
        ]
      }
    },

    {
      id: 'scene-comparison',
      type: 'computer',
      name: 'Écran de Comparaison',
      description: 'L\'écran qui permet de voir les différences entre la vraie salle et la version fake (pour la salle 1).',
      position: { x: 1250, y: 220 },
      size: { width: 120, height: 180 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'crossRoom',
          targetRoom: 'tiktok-farm',
          clueData: {
            sourceRoom: 'fake-scenes',
            targetRoom: 'tiktok-farm',
            clueType: 'comparison_data',
            value: 'scene_differences',
            description: 'Images de comparaison pour le jeu des 7 différences de la salle 1.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'scene-analysis',
        type: 'spatial',
        difficulty: 3,
        timeLimit: 180,
        component: 'SceneAnalysisPuzzle',
        data: {
          real_scene: '/images/rooms/real-studio.jpg',
          fake_scene: '/images/rooms/fake-studio.jpg',
          analysis_points: [
            'Lighting consistency',
            'Shadow angles',
            'Reflection accuracy',
            'Color temperature',
            'Depth perception',
            'Prop placement',
            'Camera angles'
          ],
          discrepancies_to_find: 7
        },
        validation: {
          type: 'exact',
          correctAnswer: 7
        },
        hints: [
          'Comparez méthodiquement chaque élément visuel.',
          'Les ombres ne mentent jamais sur la vraie source lumineuse.',
          'Les reflets révèlent souvent la supercherie.'
        ],
        rewards: []
      }
    },

    {
      id: 'props-manipulation',
      type: 'equipment',
      name: 'Manipulation d\'Accessoires',
      description: 'Replacez les accessoires dans le mauvais ordre pour ruiner la continuité des scènes.',
      position: { x: 180, y: 680 },
      size: { width: 150, height: 120 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'props-disorder',
            title: 'Accessoires Désordonnés',
            description: 'Les accessoires sont dans le mauvais ordre - leurs scènes n\'auront aucune continuité.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'props-sequence',
        type: 'sequence',
        difficulty: 2,
        timeLimit: 180,
        component: 'PropsPuzzle',
        data: {
          correct_order: ['vase', 'book', 'lamp', 'photo', 'clock'],
          shuffled_props: ['clock', 'vase', 'photo', 'book', 'lamp'],
          sabotage_goal: 'wrong_order'
        },
        validation: {
          type: 'custom',
          validator: (order: string[]) => {
            const correctOrder = ['vase', 'book', 'lamp', 'photo', 'clock'];
            return order.join() !== correctOrder.join();
          }
        },
        hints: [
          'L\'objectif est de mettre les accessoires dans le MAUVAIS ordre.',
          'Plus l\'ordre est chaotique, mieux c\'est.',
          'Assurez-vous que la séquence ne correspond pas à l\'originale.'
        ],
        rewards: []
      }
    },

    {
      id: 'camera-angles',
      type: 'equipment',
      name: 'Analyse d\'Angles de Caméra',
      description: 'Identifiez les angles de caméra impossibles qui révèlent la supercherie des faux décors.',
      position: { x: 500, y: 150 },
      size: { width: 100, height: 90 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'camera-exposed',
            title: 'Angles Impossibles',
            description: 'Vous avez identifié les angles de caméra qui prouvent que leurs décors sont faux.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'camera-angle-detection',
        type: 'spatial',
        difficulty: 3,
        timeLimit: 200,
        component: 'CameraAnglePuzzle',
        data: {
          camera_angles: [
            { angle: 45, possible: true, reason: 'Standard angle' },
            { angle: 180, possible: false, reason: 'Shows green screen edge' },
            { angle: 90, possible: true, reason: 'Side view' },
            { angle: 270, possible: false, reason: 'Reveals studio lights' },
            { angle: 135, possible: false, reason: 'Shows crew members' }
          ],
          impossible_angles_count: 3
        },
        validation: {
          type: 'exact',
          correctAnswer: [180, 270, 135]
        },
        hints: [
          'Cherchez les angles qui révèlent les équipements de studio.',
          'Les angles à 180° et 270° montrent souvent ce qui ne devrait pas être vu.',
          'Il y a exactement 3 angles impossibles à identifier.'
        ],
        rewards: []
      }
    },

    {
      id: 'audio-dubbing',
      type: 'equipment',
      name: 'Système de Doublage Audio',
      description: 'Sabotez le système audio en désynchronisant les voix et les mouvements des lèvres.',
      position: { x: 650, y: 600 },
      size: { width: 120, height: 100 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'audio-desync',
            title: 'Audio Désynchronisé',
            description: 'L\'audio est complètement désynchronisé - leurs vidéos sont inutilisables.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'audio-sync-sabotage',
        type: 'temporal',
        difficulty: 3,
        timeLimit: 200,
        component: 'AudioSyncPuzzle',
        data: {
          video_clips: 5,
          sync_offset_ms: [0, 500, -300, 700, -150],
          target_desync: 500
        },
        validation: {
          type: 'custom',
          validator: (offsets: number[]) => {
            return offsets.some(offset => Math.abs(offset) >= 500);
          }
        },
        hints: [
          'Ajoutez un délai d\'au moins 500ms pour rendre la désynchronisation évidente.',
          'Les décalages négatifs créent aussi des problèmes.',
          'Testez plusieurs clips pour maximiser l\'effet.'
        ],
        rewards: []
      }
    },

    {
      id: 'set-design-flaws',
      type: 'equipment',
      name: 'Défauts de Décor',
      description: 'Introduisez des incohérences anachroniques dans le décor (objets modernes dans une scène historique).',
      position: { x: 400, y: 450 },
      size: { width: 110, height: 95 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'anachronisms',
            title: 'Anachronismes Visibles',
            description: 'Le décor est rempli d\'incohérences temporelles - leur crédibilité est détruite.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'anachronism-placement',
        type: 'logic',
        difficulty: 2,
        timeLimit: 180,
        component: 'AnachronismPuzzle',
        data: {
          time_period: 'medieval',
          modern_items: ['smartphone', 'laptop', 'electric_light', 'plastic_bottle', 'sneakers'],
          period_items: ['candle', 'scroll', 'sword', 'goblet', 'tapestry'],
          items_to_place: 3
        },
        validation: {
          type: 'custom',
          validator: (items: string[]) => {
            const modernItems = ['smartphone', 'laptop', 'electric_light', 'plastic_bottle', 'sneakers'];
            return items.every(item => modernItems.includes(item)) && items.length >= 3;
          }
        },
        hints: [
          'Placez des objets modernes dans une scène médiévale.',
          'Plus c\'est évident, mieux c\'est.',
          'Choisissez au moins 3 objets anachroniques.'
        ],
        rewards: []
      }
    },

    {
      id: 'special-effects',
      type: 'computer',
      name: 'Effets Spéciaux Exposés',
      description: 'Révélez les trucages CGI en augmentant la transparence des couches d\'effets.',
      position: { x: 900, y: 700 },
      size: { width: 130, height: 110 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'cgi-exposed',
            title: 'CGI Exposé',
            description: 'Les effets spéciaux sont maintenant visibles - tout le monde voit les trucages.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'vfx-exposure',
        type: 'pattern',
        difficulty: 3,
        timeLimit: 200,
        component: 'VFXPuzzle',
        data: {
          effect_layers: [
            { name: 'background', transparency: 0 },
            { name: 'cgi_character', transparency: 0 },
            { name: 'lighting', transparency: 0 },
            { name: 'compositing', transparency: 0 }
          ],
          target_transparency: 50
        },
        validation: {
          type: 'custom',
          validator: (layers: any[]) => {
            return layers.some(layer => layer.transparency >= 50);
          }
        },
        hints: [
          'Augmentez la transparence des couches CGI.',
          'Une transparence de 50% ou plus rend les effets visibles.',
          'Concentrez-vous sur les couches de personnages CGI.'
        ],
        rewards: []
      }
    },

    {
      id: 'behind-scenes',
      type: 'document',
      name: 'Révélation des Coulisses',
      description: 'Publiez les images des coulisses montrant comment les scènes fake sont créées.',
      position: { x: 1100, y: 200 },
      size: { width: 100, height: 80 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'bts-leaked',
            title: 'Coulisses Révélées',
            description: 'Les images des coulisses sont publiques - tout le monde sait que c\'est fake.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'bts-leak',
        type: 'logic',
        difficulty: 2,
        timeLimit: 180,
        component: 'BTSPuzzle',
        data: {
          bts_images: [
            { filename: 'greenscreen_setup.jpg', impact: 'high' },
            { filename: 'lighting_rig.jpg', impact: 'medium' },
            { filename: 'crew_visible.jpg', impact: 'high' },
            { filename: 'script_notes.jpg', impact: 'low' },
            { filename: 'fake_props.jpg', impact: 'medium' }
          ],
          min_impact: 'high',
          images_to_leak: 2
        },
        validation: {
          type: 'custom',
          validator: (images: any[]) => {
            return images.filter(img => img.impact === 'high').length >= 2;
          }
        },
        hints: [
          'Choisissez les images à fort impact.',
          'Les images montrant le green screen sont les plus révélatrices.',
          'Vous devez sélectionner au moins 2 images à fort impact.'
        ],
        rewards: []
      }
    }
  ],

  audio: {
    ambient: '/sounds/studio-ambient.mp3',
    background: '/sounds/cinematic-tension.mp3',
    effects: {
      'power-cut': '/sounds/electrical-short.mp3',
      'lighting-change': '/sounds/switch-click.mp3',
      'meme-inject': '/sounds/digital-glitch.mp3',
      'analysis-complete': '/sounds/computer-beep.mp3',
      'sabotage-success': '/sounds/evil-laugh.mp3'
    },
    volume: {
      master: 0.8,
      ambient: 0.6,
      effects: 0.7
    }
  },

  timing: {
    totalTime: 2700, // 45 minutes
    puzzleTimeouts: {
      'sabotage-method-choice': 180,
      'color-lighting-game': 200,
      'meme-selection': 180,
      'scene-analysis': 180,
      'props-sequence': 180,
      'camera-angle-detection': 200,
      'audio-sync-sabotage': 200,
      'anachronism-placement': 180,
      'vfx-exposure': 200,
      'bts-leak': 180
    },
    hintCooldowns: {
      'sabotage-method-choice': 45,
      'color-lighting-game': 50,
      'meme-selection': 45,
      'scene-analysis': 45,
      'props-sequence': 45,
      'camera-angle-detection': 50,
      'audio-sync-sabotage': 50,
      'anachronism-placement': 45,
      'vfx-exposure': 50,
      'bts-leak': 45
    }
  },

  metadata: {
    difficulty: 3,
    estimatedTime: 18,
    minPlayers: 1,
    maxPlayers: 4,
    tags: ['fake-scenes', 'studio', 'lighting', 'memes', 'visual-effects']
  }
};

export default fakeScenesConfig;