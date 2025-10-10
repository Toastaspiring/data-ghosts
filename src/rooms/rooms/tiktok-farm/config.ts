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
      dependencies: [], // All puzzles unlocked from start
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
      dependencies: [], // All puzzles unlocked from start
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
      isUnlocked: true,
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
      dependencies: [], // All puzzles unlocked from start
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
      isUnlocked: true,
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
      dependencies: [], // All puzzles unlocked from start
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
      isUnlocked: true,
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
      id: 'fake-engagement-detection',
      type: 'device',
      name: 'Détection d\'Engagement Gonflé',
      description: 'Analysez les métriques des comptes pour identifier ceux qui achètent des vues et des likes.',
      position: { x: 180, y: 280 },
      size: { width: 90, height: 70 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'fake-detection',
            title: 'Détection de Fake',
            description: 'Vous avez exposé leurs métriques gonflées - leur crédibilité est ruinée !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'engagement-pattern-detection',
        type: 'logic',
        difficulty: 3,
        timeLimit: 300,
        component: 'EngagementPatternPuzzle',
        data: {
          accounts: [
            {
              account: '@fashionista_paris',
              followers: 250000,
              avgViews: 50000,
              avgLikes: 35000,
              avgComments: 200,
              isFake: true,
              reason: 'Ratio likes/vues = 70% (suspect > 50%). Très peu de commentaires par rapport aux likes.'
            },
            {
              account: '@tech_reviewer_pro',
              followers: 180000,
              avgViews: 120000,
              avgLikes: 8000,
              avgComments: 450,
              isFake: false
            },
            {
              account: '@travel_explorer',
              followers: 500000,
              avgViews: 25000,
              avgLikes: 22000,
              avgComments: 50,
              isFake: true,
              reason: 'Beaucoup d\'abonnés mais peu de vues. Ratio likes/vues = 88% (très suspect). Commentaires quasi inexistants.'
            },
            {
              account: '@cooking_mama',
              followers: 95000,
              avgViews: 45000,
              avgLikes: 5500,
              avgComments: 380,
              isFake: false
            },
            {
              account: '@fitness_beast',
              followers: 420000,
              avgViews: 350000,
              avgLikes: 280000,
              avgComments: 120,
              isFake: true,
              reason: 'Ratio likes/vues = 80% (énorme red flag). Engagement massif mais commentaires ridicules = bots.'
            },
            {
              account: '@art_gallery_daily',
              followers: 65000,
              avgViews: 32000,
              avgLikes: 4200,
              avgComments: 290,
              isFake: false
            }
          ]
        },
        validation: {
          type: 'exact',
          correctAnswer: [0, 2, 4] // Indices des comptes fake
        },
        hints: [
          'Un ratio likes/vues supérieur à 50% est suspect.',
          'Beaucoup de likes mais très peu de commentaires = bots.',
          'Comparez le nombre de followers avec les vues réelles.'
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
      dependencies: [],
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
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'fire-alarm-activation',
        type: 'sequence',
        difficulty: 2,
        timeLimit: 180,
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
        rewards: []
      }
    },

    {
      id: 'algorithm-manipulation',
      type: 'computer',
      name: 'Manipulation d\'Algorithme',
      description: 'Modifiez l\'algorithme de recommandation pour que leurs vidéos ne soient plus suggérées.',
      position: { x: 550, y: 150 },
      size: { width: 140, height: 100 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'algo-sabotaged',
            title: 'Algorithme Saboté',
            description: 'Leurs vidéos n\'apparaissent plus dans les recommandations - visibilité zéro.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'algorithm-hack',
        type: 'code',
        difficulty: 3,
        timeLimit: 240,
        component: 'AlgorithmPuzzle',
        data: {
          parameters: [
            { name: 'engagement_rate', current: 85, min: 0, max: 100, target: 15, weight: 1.0, linkedTo: ['viral_coefficient'] },
            { name: 'watch_time', current: 90, min: 0, max: 100, target: 20, weight: 1.2, linkedTo: ['retention_rate'] },
            { name: 'share_velocity', current: 75, min: 0, max: 100, target: 10, weight: 0.9, linkedTo: ['engagement_rate', 'comment_density'] },
            { name: 'comment_density', current: 70, min: 0, max: 100, target: 15, weight: 0.8, linkedTo: ['share_velocity'] },
            { name: 'viral_coefficient', current: 80, min: 0, max: 100, target: 12, weight: 1.1, linkedTo: ['engagement_rate', 'watch_time'] },
            { name: 'retention_rate', current: 88, min: 0, max: 100, target: 25, weight: 1.0, linkedTo: ['watch_time'] },
            { name: 'follower_growth', current: 65, min: 0, max: 100, target: 18, weight: 0.7, linkedTo: ['viral_coefficient', 'engagement_rate'] },
            { name: 'interaction_score', current: 78, min: 0, max: 100, target: 20, weight: 0.9, linkedTo: ['comment_density', 'share_velocity'] }
          ],
          threshold: 25,
          maxTotalScore: 185,
          constraints: [
            { params: ['engagement_rate', 'watch_time'], rule: 'Baisser engagement_rate augmente watch_time de 30%' },
            { params: ['share_velocity', 'viral_coefficient'], rule: 'Si share_velocity < 30, viral_coefficient -20' },
            { params: ['comment_density', 'interaction_score'], rule: 'Ces deux doivent avoir max 10 pts de différence' }
          ]
        },
        validation: {
          type: 'custom',
          validator: (params: any[]) => {
            const allUnderThreshold = params.every(p => p.value <= 25);
            const totalScore = params.reduce((sum, p) => sum + (p.value * (p.weight || 1)), 0);
            return allUnderThreshold && totalScore <= 185;
          }
        },
        hints: [
          'Chaque paramètre doit être ≤ 25, mais attention aux dépendances !',
          'Baisser un paramètre peut en augmenter d\'autres - trouvez l\'équilibre.',
          'Le score total pondéré doit rester sous 185 points.'
        ],
        rewards: []
      }
    },

    {
      id: 'comment-management',
      type: 'device',
      name: 'Gestion des Commentaires',
      description: 'Remplissez la section commentaires avec des critiques et des accusations de fake.',
      position: { x: 900, y: 500 },
      size: { width: 130, height: 90 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'comments-flooded',
            title: 'Commentaires Négatifs',
            description: 'Leurs vidéos sont inondées de commentaires négatifs - leur réputation est ruinée.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'comment-flood',
        type: 'pattern',
        difficulty: 3,
        timeLimit: 300,
        component: 'CommentPuzzle',
        data: {
          required_words: [
            'fake',
            'mensonge',
            'arnaque',
            'manipulation',
            'publicité',
            'green screen',
            'montage',
            'truqué',
            'déçu',
            'boycott'
          ],
          target_count: 15,
        },
        validation: {
          type: 'custom',
          validator: (comments: string[]) => {
            return comments.length >= 15;
          }
        },
        hints: [
          'Vous devez utiliser TOUS les mots requis dans vos commentaires.',
          'Écrivez au moins 15 commentaires négatifs crédibles.',
          'Les mots peuvent être utilisés dans différents commentaires.'
        ],
        rewards: []
      }
    },

    {
      id: 'view-inflation',
      type: 'computer',
      name: 'Détection de Vues Gonflées',
      description: 'Exposez les preuves que leurs vues sont achetées et non organiques.',
      position: { x: 750, y: 700 },
      size: { width: 120, height: 85 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'fake-views-exposed',
            title: 'Vues Artificielles',
            description: 'Preuves que 80% de leurs vues sont des bots - leur fraude est exposée.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'view-analysis',
        type: 'analysis',
        difficulty: 3,
        timeLimit: 200,
        component: 'ViewAnalysisPuzzle',
        data: {
          total_views: 5000000,
          organic_indicators: {
            watch_time_avg: 3,
            engagement_rate: 0.02,
            geographic_diversity: 0.15,
            device_variety: 0.25
          },
          bot_indicators: {
            watch_time_avg: 0.5,
            engagement_rate: 0.001,
            geographic_clustering: 0.95,
            device_repetition: 0.85
          },
          bot_percentage_threshold: 60
        },
        validation: {
          type: 'custom',
          validator: (analysis: any) => {
            return analysis.bot_percentage >= 60;
          }
        },
        hints: [
          'Analysez les patterns de visionnage suspects.',
          'Les bots ont des temps de visionnage très courts.',
          'La diversité géographique faible indique des bots.'
        ],
        rewards: []
      }
    },

    {
      id: 'engagement-metrics',
      type: 'device',
      name: 'Manipulation des Métriques',
      description: 'Sabotez leurs métriques d\'engagement pour faire chuter leur score de créateur.',
      position: { x: 300, y: 500 },
      size: { width: 110, height: 95 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'metrics-crashed',
            title: 'Métriques Effondrées',
            description: 'Leur score de créateur est en chute libre - démonétisation imminente.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'metrics-sabotage',
        type: 'logic',
        difficulty: 2,
        timeLimit: 180,
        component: 'MetricsPuzzle',
        data: {
          metrics: [
            { name: 'likes', current: 500000, target: 50000 },
            { name: 'shares', current: 100000, target: 5000 },
            { name: 'saves', current: 80000, target: 8000 },
            { name: 'follows', current: 250000, target: 25000 }
          ],
          reduction_factor: 10
        },
        validation: {
          type: 'custom',
          validator: (metrics: any[]) => {
            return metrics.every(m => m.value <= m.current / 10);
          }
        },
        hints: [
          'Réduisez chaque métrique d\'au moins 90%.',
          'Les likes et follows sont les plus importants.',
          'Divisez toutes les valeurs par 10 minimum.'
        ],
        rewards: []
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
      'hashtag-replacement': 180,
      'viral-creation': 200,
      'fact-correction': 180,
      'seven-differences-game': 200,
      'fire-alarm-activation': 180,
      'algorithm-hack': 200,
      'comment-flood': 180,
      'view-analysis': 200,
      'metrics-sabotage': 180
    },
    hintCooldowns: {
      'captcha-puzzle': 45,
      'hashtag-replacement': 45,
      'viral-creation': 50,
      'fact-correction': 45,
      'seven-differences-game': 50,
      'fire-alarm-activation': 45,
      'algorithm-hack': 50,
      'comment-flood': 45,
      'view-analysis': 50,
      'metrics-sabotage': 45
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