import { RoomConfig } from '../../core/types';

export const videoEditorsConfig: RoomConfig = {
  id: 'video-editors',
  name: 'Salle des Monteurs',
  description: 'Corrompez les monteurs vidéo par différents moyens et sabotez leur matériel pour ruiner leur production.',
  
  theme: {
    primary: {
      neon: '#9400D3', // Purple
      glow: '#8A2BE2', // Blue violet
      dark: '#2F0F4F'
    },
    environment: 'space',
    ambientSound: '/sounds/editing-room-ambient.mp3',
    backgroundMusic: '/sounds/digital-workspace.mp3'
  },

  layout: {
    background: '/images/rooms/editing-room-bg.jpg',
    width: 1600,
    height: 1000,
    zones: [
      {
        id: 'editor-desk-1',
        bounds: { x: 100, y: 200, w: 300, h: 200 },
        theme: 'workstation',
        interactive: true
      },
      {
        id: 'editor-desk-2',
        bounds: { x: 500, y: 300, w: 300, h: 200 },
        theme: 'workstation',
        interactive: true
      },
      {
        id: 'contract-area',
        bounds: { x: 900, y: 150, w: 200, h: 150 },
        theme: 'documents',
        interactive: true
      },
      {
        id: 'equipment-storage',
        bounds: { x: 200, y: 600, w: 400, h: 250 },
        theme: 'equipment',
        interactive: true
      },
      {
        id: 'timecode-station',
        bounds: { x: 1200, y: 400, w: 250, h: 200 },
        theme: 'video',
        interactive: true
      }
    ]
  },

  elements: [
    {
      id: 'corruption-choice',
      type: 'document',
      name: 'Choix de Corruption',
      description: 'Choisissez comment corrompre le monteur principal : argent, chantage, ou sabotage technique.',
      position: { x: 200, y: 280 },
      size: { width: 120, height: 80 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'editor-corrupted',
            title: 'Monteur Corrompu',
            description: 'Le monteur principal est maintenant de votre côté.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'corruption-method',
        type: 'logic',
        difficulty: 3,
        timeLimit: 240,
        component: 'CorruptionChoicePuzzle',
        data: {
          methods: [
            {
              name: 'Soudoyer avec de l\'argent',
              cost: 'high',
              reliability: 'medium',
              suspicion: 'high',
              effectiveness: 'high'
            },
            {
              name: 'Retenir sa famille en otage',
              cost: 'none',
              reliability: 'high', 
              suspicion: 'extreme',
              effectiveness: 'high',
              illegal: true
            },
            {
              name: 'Enlever sa licence logicielle',
              cost: 'low',
              reliability: 'medium',
              suspicion: 'low',
              effectiveness: 'medium'
            }
          ],
          moral_choice: true
        },
        validation: {
          type: 'custom',
          validator: (choice: number) => {
            // Choice 2 (license removal) is optimal - low suspicion, legal
            return choice === 2;
          }
        },
        hints: [
          'Évitez les méthodes illégales qui attireraient l\'attention.',
          'La suspension de licence est légale et efficace.',
          'Pensez aux conséquences à long terme.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['contract-documents']
          }
        ]
      }
    },

    {
      id: 'contract-documents',
      type: 'document',
      name: 'Contrats de Licence',
      description: 'Les contrats de licence des logiciels de montage. Trouvez les clauses pour suspendre leur accès.',
      position: { x: 950, y: 200 },
      size: { width: 100, height: 80 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'license-suspended',
            title: 'Licences Suspendues',
            description: 'Leurs logiciels de montage sont bloqués - ils ne peuvent plus travailler.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'contract-analysis',
        type: 'logic',
        difficulty: 4,
        timeLimit: 480,
        component: 'ContractPuzzle',
        data: {
          contract_clauses: [
            'Payment must be received within 30 days',
            'Software updates require active subscription',
            'Violation of terms results in immediate suspension',
            'Educational use requires student verification',
            'Commercial use requires business license'
          ],
          violations_found: [
            'Expired payment (45 days overdue)',
            'Using educational license for commercial work',
            'Shared credentials across multiple users'
          ],
          suspension_trigger: 'any_violation'
        },
        validation: {
          type: 'exact',
          correctAnswer: [0, 1, 2] // All violations identified
        },
        hints: [
          'Cherchez les violations dans les conditions d\'utilisation.',
          'Les licences éducatives ne peuvent pas être utilisées commercialement.',
          'Les paiements en retard sont une violation automatique.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['editor-exodus']
          }
        ]
      }
    },

    {
      id: 'editor-exodus',
      type: 'computer',
      name: 'Départ du Monteur',
      description: 'Le monteur part, laissant un post-it avec le mot de passe TikTok sur son écran.',
      position: { x: 580, y: 380 },
      size: { width: 140, height: 90 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'crossRoom',
          targetRoom: 'tiktok-farm',
          clueData: {
            sourceRoom: 'video-editors',
            targetRoom: 'tiktok-farm',
            clueType: 'account_access',
            value: 'tiktok_password_instavibe2024',
            description: 'Mot de passe pour supprimer le compte TikTok principal.'
          }
        },
        {
          type: 'clue',
          data: {
            id: 'tiktok-access',
            title: 'Accès TikTok',
            description: 'Mot de passe trouvé : instavibe2024 - vous pouvez maintenant supprimer leur compte !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'password-discovery',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 180,
        component: 'PasswordDiscoveryPuzzle',
        data: {
          screen_elements: [
            'Sticky note on monitor',
            'Keyboard layout',
            'Recent documents',
            'Browser bookmarks'
          ],
          password_hints: [
            'Company name',
            'Current year',
            'Common separator'
          ],
          post_it_text: 'instavibe2024'
        },
        validation: {
          type: 'exact',
          correctAnswer: 'instavibe2024'
        },
        hints: [
          'Le post-it est directement visible sur l\'écran.',
          'Les monteurs utilisent souvent des mots de passe simples.',
          'Nom de l\'entreprise + année = mot de passe classique.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['timecode-puzzle']
          }
        ]
      }
    },

    {
      id: 'timecode-puzzle',
      type: 'computer',
      name: 'Station Timecode',
      description: 'Mettez en pause une vidéo au bon moment pour révéler des informations cachées.',
      position: { x: 1280, y: 480 },
      size: { width: 150, height: 120 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'hidden-message',
            title: 'Message Caché',
            description: 'Frame 1247 révèle un message subliminal dans leur vidéo !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'video-timecode-analysis',
        type: 'temporal',
        difficulty: 4,
        timeLimit: 420,
        component: 'VideoTimecodePuzzle',
        data: {
          video_duration: 180, // 3 minutes
          target_frame: 1247,
          frames_per_second: 30,
          hidden_message_frames: [1247, 1248, 1249],
          precision_required: 1 // 1 frame precision
        },
        validation: {
          type: 'exact',
          correctAnswer: 1247
        },
        hints: [
          'Le message est caché dans les frames 1247-1249.',
          'Utilisez les contrôles frame par frame.',
          'Le timecode exact est 00:41:33 (frame 1247).'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['equipment-sabotage']
          }
        ]
      }
    },

    {
      id: 'equipment-sabotage',
      type: 'equipment',
      name: 'Sabotage du Matériel',
      description: 'Sabotez discrètement leur équipement : débranchez des câbles ou renversez de l\'eau.',
      position: { x: 350, y: 700 },
      size: { width: 180, height: 150 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'equipment-destroyed',
            title: 'Matériel Sabotage',
            description: 'Leur équipement est hors service - aucune vidéo ne peut plus être produite.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'subtle-sabotage',
        type: 'logic',
        difficulty: 3,
        timeLimit: 300,
        component: 'SabotagePuzzle',
        data: {
          sabotage_options: [
            {
              method: 'Débrancher les câbles',
              stealth: 'high',
              damage: 'none',
              recovery_time: '5 minutes'
            },
            {
              method: 'Renverser de l\'eau sur le clavier',
              stealth: 'medium',
              damage: 'medium',
              recovery_time: '2 hours'
            },
            {
              method: 'Supprimer les fichiers projet',
              stealth: 'high',
              damage: 'high',
              recovery_time: '1 week'
            },
            {
              method: 'Casser l\'écran',
              stealth: 'low',
              damage: 'high',
              recovery_time: '3 days'
            }
          ],
          optimal_strategy: 'maximum_disruption_minimum_detection'
        },
        validation: {
          type: 'custom',
          validator: (selections: number[]) => {
            // Optimal: cable disconnection + file deletion (high stealth)
            return selections.includes(0) && selections.includes(2);
          }
        },
        hints: [
          'Combinez plusieurs méthodes discrètes.',
          'La suppression de fichiers n\'est pas détectable immédiatement.',
          'Évitez les méthodes qui font du bruit ou laissent des traces.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['hashtag-notebook']
          }
        ]
      }
    },

    {
      id: 'hashtag-notebook',
      type: 'document',
      name: 'Bloc-notes Hashtags',
      description: 'Un bloc-notes avec la liste des hashtags à éviter. Informations utiles pour la salle 1.',
      position: { x: 120, y: 350 },
      size: { width: 80, height: 60 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'crossRoom',
          targetRoom: 'tiktok-farm',
          clueData: {
            sourceRoom: 'video-editors',
            targetRoom: 'tiktok-farm',
            clueType: 'hashtag_trends',
            value: ['#Aesthetic', '#Viral', '#Trending', '#InfluencerLife'],
            description: 'Hashtags tendance à utiliser pour la vidéo virale.'
          }
        },
        {
          type: 'clue',
          data: {
            id: 'room3-code',
            title: 'Troisième Code',
            description: 'Code de la salle 3 : 7629'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'hashtag-analysis',
        type: 'analysis',
        difficulty: 2,
        timeLimit: 200,
        component: 'HashtagAnalysisPuzzle',
        data: {
          trending_hashtags: ['#Aesthetic', '#Viral', '#Trending', '#InfluencerLife'],
          avoid_hashtags: ['#Fake', '#Sponsored', '#Ad', '#Promotion'],
          neutral_hashtags: ['#Photography', '#Art', '#Creative', '#Style'],
          analysis_required: 'identify_trending'
        },
        validation: {
          type: 'exact',
          correctAnswer: ['#Aesthetic', '#Viral', '#Trending', '#InfluencerLife']
        },
        hints: [
          'Identifiez les hashtags qui génèrent le plus d\'engagement.',
          'Évitez ceux marqués comme "à éviter" dans les notes.',
          'Les hashtags tendance changent selon les plateformes.'
        ],
        rewards: [
          {
            type: 'score',
            data: { points: 1500, category: 'room-completion' }
          }
        ]
      }
    }
  ],

  audio: {
    ambient: '/sounds/editing-room-ambient.mp3',
    background: '/sounds/digital-workspace.mp3',
    effects: {
      'contract-sign': '/sounds/paper-rustle.mp3',
      'computer-crash': '/sounds/computer-error.mp3',
      'water-spill': '/sounds/water-splash.mp3',
      'cable-disconnect': '/sounds/unplug.mp3',
      'keyboard-break': '/sounds/keyboard-smash.mp3'
    },
    volume: {
      master: 0.8,
      ambient: 0.5,
      effects: 0.8
    }
  },

  timing: {
    totalTime: 2700, // 45 minutes
    puzzleTimeouts: {
      'corruption-method': 240,
      'contract-analysis': 480,
      'password-discovery': 180,
      'video-timecode-analysis': 420,
      'subtle-sabotage': 300,
      'hashtag-analysis': 200
    },
    hintCooldowns: {
      'corruption-method': 60,
      'contract-analysis': 120,
      'password-discovery': 45,
      'video-timecode-analysis': 100,
      'subtle-sabotage': 75,
      'hashtag-analysis': 50
    }
  },

  metadata: {
    difficulty: 4,
    estimatedTime: 25,
    minPlayers: 1,
    maxPlayers: 4,
    tags: ['video-editing', 'corruption', 'sabotage', 'contracts', 'timecode']
  }
};

export default videoEditorsConfig;