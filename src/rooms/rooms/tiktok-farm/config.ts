import { RoomConfig } from '../../core/types';

export const tiktokFarmConfig: RoomConfig = {
  id: 'tiktok-farm',
  name: 'La Ferme TikTok',
  description: 'Sabotez la production de vidéos virales en infiltrant leurs téléphones et en perturbant leur contenu.',
  
  theme: {
    primary: {
      neon: '#FF0050', // TikTok pink
      glow: '#25F4EE', // TikTok cyan
      dark: '#0F0F23'
    },
    environment: 'space',
    ambientSound: '/sounds/tiktok-farm-ambient.mp3',
    backgroundMusic: '/sounds/electronic-beat.mp3'
  },

  layout: {
    background: '/images/rooms/tiktok-farm-bg.jpg',
    width: 1400,
    height: 900,
    zones: [
      {
        id: 'phone-station-1',
        bounds: { x: 100, y: 200, w: 200, h: 150 },
        theme: 'phone',
        interactive: true
      },
      {
        id: 'tablet-area',
        bounds: { x: 400, y: 300, w: 250, h: 200 },
        theme: 'tablet',
        interactive: true
      },
      {
        id: 'whiteboard-area',
        bounds: { x: 800, y: 150, w: 300, h: 250 },
        theme: 'information',
        interactive: true
      },
      {
        id: 'phone-station-2',
        bounds: { x: 200, y: 600, w: 200, h: 150 },
        theme: 'phone',
        interactive: true
      },
      {
        id: 'alarm-control',
        bounds: { x: 1200, y: 100, w: 150, h: 100 },
        theme: 'control',
        interactive: true
      }
    ]
  },

  elements: [
    {
      id: 'phone-captcha',
      type: 'device',
      name: 'Téléphone - Accès',
      description: 'Un téléphone verrouillé par un captcha. Résolvez-le pour accéder au système.',
      position: { x: 150, y: 250 },
      size: { width: 80, height: 120 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'phone-access',
            title: 'Accès Téléphone',
            description: 'Vous avez accès au téléphone principal des influenceurs.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'captcha-puzzle',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 180,
        component: 'CaptchaPuzzle',
        data: {
          images: [
            { src: '/images/captcha/car1.jpg', isTarget: true },
            { src: '/images/captcha/tree1.jpg', isTarget: false },
            { src: '/images/captcha/car2.jpg', isTarget: true },
            { src: '/images/captcha/building1.jpg', isTarget: false },
            { src: '/images/captcha/car3.jpg', isTarget: true },
            { src: '/images/captcha/tree2.jpg', isTarget: false }
          ],
          instruction: 'Sélectionnez toutes les images contenant des voitures'
        },
        validation: {
          type: 'exact',
          correctAnswer: [0, 2, 4] // Indices des voitures
        },
        hints: [
          'Regardez attentivement chaque image.',
          'Les voitures peuvent être partiellement cachées.',
          'Il y a exactement 3 voitures dans cette série.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['hashtag-sabotage']
          }
        ]
      }
    },

    {
      id: 'hashtag-sabotage',
      type: 'device',
      name: 'Sabotage Hashtags',
      description: 'Remplacez les hashtags tendance par des alternatives pour saboter la viralité.',
      position: { x: 450, y: 350 },
      size: { width: 150, height: 100 },
      dependencies: ['phone-captcha'],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'hashtag-trends',
            title: 'Tendances Sabotées',
            description: 'Vous avez remplacé #ViralContent par #BoringStuff - leur reach va chuter !'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'hashtag-replacement',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 240,
        component: 'HashtagPuzzle',
        data: {
          originalHashtags: ['#ViralContent', '#TrendingNow', '#InstaFamous', '#Aesthetic'],
          sabotageOptions: [
            ['#BoringStuff', '#DeadMeme', '#Irrelevant'],
            ['#OutOfDate', '#NotTrending', '#Forgotten'],
            ['#Unknown', '#NobodyKnows', '#Invisible'],
            ['#Ugly', '#BadFilter', '#Unflattering']
          ],
          targetViews: 1000000,
          currentViews: 5000000
        },
        validation: {
          type: 'custom',
          validator: (selection: number[]) => {
            // Check if sabotage reduces views significantly
            const reductionFactor = selection.reduce((sum, choice) => sum + (choice * 0.3), 0.1);
            return reductionFactor > 0.8; // Must reduce by 80%
          }
        },
        hints: [
          'Choisissez les hashtags les plus ennuyeux pour réduire la viralité.',
          'Plus c\'est ringard, mieux c\'est !',
          'Visez une réduction de 80% des vues.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['viral-video-creation']
          }
        ]
      }
    },

    {
      id: 'viral-video-creation',
      type: 'device',
      name: 'Création Vidéo Virale',
      description: 'Créez une vidéo TikTok qui surpasse les influenceurs en utilisant les indices des autres salles.',
      position: { x: 250, y: 650 },
      size: { width: 100, height: 80 },
      dependencies: ['hashtag-sabotage'],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'viral-success',
            title: 'Vidéo Virale',
            description: 'Votre vidéo a fait 10M de vues ! Les influenceurs sont détrônés.'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'viral-creation',
        type: 'collaboration',
        difficulty: 4,
        timeLimit: 600,
        component: 'ViralVideoPuzzle',
        data: {
          requiredElements: {
            trending_hashtag: '', // From room 3
            background_style: '', // From room 2  
            editing_trick: ''     // From room 3
          },
          viralFormula: {
            hashtags: 3,
            duration: '15-30s',
            trend_factor: 'high',
            engagement_hooks: 2
          }
        },
        validation: {
          type: 'custom',
          validator: (videoData: any) => {
            return videoData.hashtags?.length >= 3 && 
                   videoData.trend_factor === 'high' &&
                   videoData.engagement_hooks >= 2;
          }
        },
        hints: [
          'Utilisez les hashtags découverts dans la salle des monteurs.',
          'Le style de fond de la salle fake scene est crucial.',
          'Les tricks d\'édition augmentent l\'engagement.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['misinformation-board']
          }
        ]
      }
    },

    {
      id: 'misinformation-board',
      type: 'document',
      name: 'Tableau des Fausses Infos',
      description: 'Corrigez les fausses informations affichées sur le tableau blanc pour créer le chaos.',
      position: { x: 850, y: 200 },
      size: { width: 200, height: 150 },
      dependencies: ['viral-video-creation'],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'misinformation-corrected',
            title: 'Infos Corrigées',
            description: 'Vous avez transformé leurs "faits" en vraies informations - leur crédibilité est ruinée !'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'fact-correction',
        type: 'logic',
        difficulty: 3,
        timeLimit: 300,
        component: 'FactCheckPuzzle',
        data: {
          false_statements: [
            'Les vaccins causent l\'autisme',
            'La Terre est plate',
            'Le 5G contrôle les esprits',
            'Les chemtrails sont réels'
          ],
          correct_facts: [
            'Les vaccins sont sûrs et efficaces',
            'La Terre est ronde',
            'Le 5G est une technologie radio normale',
            'Les traînées d\'avion sont de la vapeur d\'eau'
          ]
        },
        validation: {
          type: 'exact',
          correctAnswer: [1, 1, 1, 1] // All corrected
        },
        hints: [
          'Remplacez chaque fausse information par le fait scientifique.',
          'La vérité est toujours plus boring que les théories du complot.',
          'Ils ne peuvent plus mentir si vous affichez la vérité !'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['seven-differences']
          }
        ]
      }
    },

    {
      id: 'seven-differences',
      type: 'device',
      name: 'Jeu des 7 Différences',
      description: 'Trouvez les 7 différences entre la vraie salle et la version fake filmée.',
      position: { x: 180, y: 280 },
      size: { width: 90, height: 70 },
      dependencies: ['misinformation-board'],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'fake-detection',
            title: 'Détection de Fake',
            description: 'Vous savez maintenant distinguer le vrai du faux - leur supercherie est exposée !'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'seven-differences-game',
        type: 'spatial',
        difficulty: 3,
        timeLimit: 420,
        component: 'SevenDifferencesPuzzle',
        data: {
          image1: '/images/rooms/real-room.jpg',
          image2: '/images/rooms/fake-room.jpg',
          differences: [
            { x: 150, y: 200, radius: 30 },
            { x: 300, y: 150, radius: 25 },
            { x: 450, y: 300, radius: 35 },
            { x: 600, y: 180, radius: 28 },
            { x: 750, y: 250, radius: 32 },
            { x: 500, y: 400, radius: 30 },
            { x: 200, y: 350, radius: 26 }
          ]
        },
        validation: {
          type: 'exact',
          correctAnswer: 7 // All differences found
        },
        hints: [
          'Regardez attentivement les objets et leur position.',
          'Certaines différences sont subtiles (couleurs, tailles).',
          'Les éclairages peuvent être différents entre les deux images.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['fire-alarm']
          }
        ]
      }
    },

    {
      id: 'fire-alarm',
      type: 'device',
      name: 'Alarme Incendie',
      description: 'Déclenchez l\'alarme incendie pour évacuer les gens de la salle 2 et permettre le sabotage.',
      position: { x: 1250, y: 130 },
      size: { width: 80, height: 60 },
      dependencies: ['seven-differences'],
      rewards: [
        {
          type: 'crossRoom',
          targetRoom: 'fake-scenes',
          clueData: {
            sourceRoom: 'tiktok-farm',
            targetRoom: 'fake-scenes',
            clueType: 'evacuation',
            value: 'fire-alarm-activated',
            description: 'L\'alarme incendie a évacué la salle 2 - vous pouvez maintenant y entrer en sécurité.'
          }
        },
        {
          type: 'clue',
          data: {
            id: 'room1-code',
            title: 'Premier Code',
            description: 'Code de la salle 1 : 2847'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'fire-alarm-activation',
        type: 'sequence',
        difficulty: 2,
        timeLimit: 120,
        component: 'AlarmActivationPuzzle',
        data: {
          sequence: ['BREAK_GLASS', 'PULL_LEVER', 'CONFIRM_EVACUATION'],
          safetyWarning: true
        },
        validation: {
          type: 'exact',
          correctAnswer: ['BREAK_GLASS', 'PULL_LEVER', 'CONFIRM_EVACUATION']
        },
        hints: [
          'Suivez la procédure standard d\'urgence.',
          'Cassez d\'abord la vitre de protection.',
          'Confirmez l\'évacuation pour déclencher l\'alarme dans la salle 2.'
        ],
        rewards: [
          {
            type: 'score',
            data: { points: 1000, category: 'room-completion' }
          }
        ]
      }
    }
  ],

  audio: {
    ambient: '/sounds/tiktok-farm-ambient.mp3',
    background: '/sounds/electronic-beat.mp3',
    effects: {
      'phone-unlock': '/sounds/phone-unlock.mp3',
      'hashtag-change': '/sounds/keyboard-click.mp3',
      'viral-success': '/sounds/success-fanfare.mp3',
      'alarm': '/sounds/fire-alarm.mp3',
      'puzzle-complete': '/sounds/puzzle-success.mp3'
    },
    volume: {
      master: 0.8,
      ambient: 0.5,
      effects: 0.7
    }
  },

  timing: {
    totalTime: 2700, // 45 minutes
    puzzleTimeouts: {
      'captcha-puzzle': 180,
      'hashtag-replacement': 240,
      'viral-creation': 600,
      'fact-correction': 300,
      'seven-differences-game': 420,
      'fire-alarm-activation': 120
    },
    hintCooldowns: {
      'captcha-puzzle': 45,
      'hashtag-replacement': 60,
      'viral-creation': 120,
      'fact-correction': 75,
      'seven-differences-game': 90,
      'fire-alarm-activation': 30
    }
  },

  metadata: {
    difficulty: 3,
    estimatedTime: 20,
    minPlayers: 1,
    maxPlayers: 4,
    tags: ['tiktok', 'social-media', 'sabotage', 'viral', 'misinformation']
  }
};

export default tiktokFarmConfig;