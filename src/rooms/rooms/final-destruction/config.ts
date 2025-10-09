import { RoomConfig } from '../../core/types';

export const finalDestructionConfig: RoomConfig = {
  id: 'final-destruction',
  name: 'Salle de Destruction Finale',
  description: 'Utilisez les trois codes des salles précédentes pour accéder au bouton rouge et détruire Insta-Vibe définitivement.',
  
  theme: {
    primary: {
      neon: '#FF0000', // Red alert
      glow: '#FF4500', // Orange red
      dark: '#330000'
    },
    environment: 'space',
    ambientSound: '/sounds/final-room-tension.mp3',
    backgroundMusic: '/sounds/epic-destruction.mp3'
  },

  layout: {
    background: '/images/rooms/final-destruction-bg.jpg',
    width: 1200,
    height: 800,
    zones: [
      {
        id: 'code-entry-panel',
        bounds: { x: 100, y: 200, w: 300, h: 200 },
        theme: 'security',
        interactive: true
      },
      {
        id: 'red-button-chamber',
        bounds: { x: 500, y: 150, w: 400, h: 300 },
        theme: 'destruction',
        interactive: true
      },
      {
        id: 'countdown-display',
        bounds: { x: 700, y: 500, w: 200, h: 150 },
        theme: 'display',
        interactive: false
      },
      {
        id: 'escape-route',
        bounds: { x: 50, y: 600, w: 150, h: 100 },
        theme: 'exit',
        interactive: false
      }
    ]
  },

  elements: [
    {
      id: 'three-code-entry',
      type: 'computer',
      name: 'Panneau de Codes',
      description: 'Entrez les trois codes obtenus dans les salles précédentes pour déverrouiller la chambre finale.',
      position: { x: 200, y: 280 },
      size: { width: 120, height: 100 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'access-granted',
            title: 'Accès Autorisé',
            description: 'Tous les codes sont corrects ! La chambre du bouton rouge est déverrouillée.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'triple-code-entry',
        type: 'code',
        difficulty: 2,
        timeLimit: 300,
        component: 'TripleCodePuzzle',
        data: {
          required_codes: [
            { source: 'Salle 1 - Ferme TikTok', code: '2847' },
            { source: 'Salle 2 - Scènes Fake', code: '1593' },
            { source: 'Salle 3 - Monteurs', code: '7629' }
          ],
          entry_format: 'sequential',
          validation_immediate: true
        },
        validation: {
          type: 'exact',
          correctAnswer: ['2847', '1593', '7629']
        },
        hints: [
          'Entrez les codes dans l\'ordre des salles : 1, 2, 3.',
          'Le code de la salle 1 était : 2847',
          'Vérifiez que chaque code contient exactement 4 chiffres.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['red-button-activation']
          }
        ]
      }
    },

    {
      id: 'red-button-activation',
      type: 'device',
      name: 'Bouton Rouge de Destruction',
      description: 'LE bouton rouge ! Appuyez pour lancer la séquence de destruction finale d\'Insta-Vibe.',
      position: { x: 650, y: 250 },
      size: { width: 150, height: 150 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'destruction-initiated',
            title: 'Destruction Initiée',
            description: 'Insta-Vibe va exploser ! Courez vers la sortie !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'button-spam-sequence',
        type: 'sequence',
        difficulty: 3,
        timeLimit: 45,
        component: 'FinalButtonPuzzle',
        data: {
          activation_type: 'spam_or_simon',
          spam_config: {
            required_clicks: 50,
            time_limit: 30,
            acceleration: true
          },
          simon_config: {
            sequence_length: 8,
            colors: ['red', 'blue', 'green', 'yellow'],
            speed_increase: true
          },
          choice_method: 'random' // Randomly chooses between spam or simon
        },
        validation: {
          type: 'custom',
          validator: (result: any) => {
            if (result.type === 'spam') {
              return result.clicks >= 50;
            } else if (result.type === 'simon') {
              return result.sequence_completed === true;
            }
            return false;
          }
        },
        hints: [
          'Si c\'est du spam : cliquez le plus vite possible !',
          'Si c\'est Simon : mémorisez et répétez la séquence.',
          'Vous avez très peu de temps - restez concentré !'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['countdown-timer']
          }
        ]
      }
    },

    {
      id: 'countdown-timer',
      type: 'device',
      name: 'Compte à Rebours',
      description: 'Le compte à rebours final avant l\'explosion ! 30 secondes pour s\'échapper !',
      position: { x: 750, y: 550 },
      size: { width: 100, height: 80 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'escape-time',
            title: 'Temps d\'Évasion',
            description: '30 secondes avant l\'explosion ! COUREZ !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'countdown-escape',
        type: 'temporal',
        difficulty: 1,
        timeLimit: 30,
        component: 'CountdownEscapePuzzle',
        data: {
          countdown_duration: 30,
          escape_target: 'building_exit',
          visual_effects: [
            'screen_shake',
            'red_flashing',
            'alarm_sounds',
            'explosion_buildup'
          ],
          success_condition: 'reach_exit_before_zero'
        },
        validation: {
          type: 'custom',
          validator: (escapeTime: number) => {
            return escapeTime > 0; // Must escape before countdown reaches 0
          }
        },
        hints: [
          'Cliquez rapidement sur la sortie !',
          'Ne perdez pas de temps - l\'explosion est imminente !',
          'L\'icône de sortie clignote en vert.'
        ],
        rewards: [
          {
            type: 'unlock',
            elementIds: ['victory-escape']
          }
        ]
      }
    },

    {
      id: 'victory-escape',
      type: 'device',
      name: 'Évasion Victorieuse',
      description: 'Vous avez réussi ! Regardez l\'explosion depuis l\'extérieur du bâtiment.',
      position: { x: 100, y: 650 },
      size: { width: 80, height: 60 },
      dependencies: [], // All puzzles unlocked from start
      rewards: [
        {
          type: 'score',
          data: { points: 5000, category: 'game-completion' }
        },
        {
          type: 'clue',
          data: {
            id: 'mission-accomplished',
            title: 'Mission Accomplie',
            description: 'Insta-Vibe est détruit ! Vous avez sauvé le monde des influenceurs toxiques !'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'victory-sequence',
        type: 'sequence',
        difficulty: 1,
        timeLimit: 60,
        component: 'VictorySequencePuzzle',
        data: {
          explosion_animation: true,
          escape_image: '/images/victory/players-escaping.jpg',
          building_explosion: '/images/victory/building-explosion.gif',
          victory_message: 'Félicitations ! Vous avez détruit Insta-Vibe et libéré le monde des influenceurs toxiques !',
          final_score_calculation: true
        },
        validation: {
          type: 'custom',
          validator: () => true // Always succeeds - this is the victory screen
        },
        hints: [
          'Profitez de votre victoire !',
          'Regardez l\'explosion depuis une distance sûre.',
          'Mission accomplie - vous êtes des héros !'
        ],
        rewards: [
          {
            type: 'score',
            data: { points: 10000, category: 'perfect-completion' }
          }
        ]
      }
    }
  ],

  audio: {
    ambient: '/sounds/final-room-tension.mp3',
    background: '/sounds/epic-destruction.mp3',
    effects: {
      'code-beep': '/sounds/security-beep.mp3',
      'access-granted': '/sounds/access-granted.mp3',
      'button-press': '/sounds/big-button-press.mp3',
      'countdown-tick': '/sounds/countdown-tick.mp3',
      'explosion': '/sounds/massive-explosion.mp3',
      'victory-fanfare': '/sounds/victory-fanfare.mp3',
      'alarm-blare': '/sounds/evacuation-alarm.mp3'
    },
    volume: {
      master: 1.0,
      ambient: 0.7,
      effects: 0.9
    }
  },

  timing: {
    totalTime: 2700, // 45 minutes max
    puzzleTimeouts: {
      'triple-code-entry': 300,
      'button-spam-sequence': 45,
      'countdown-escape': 30,
      'victory-sequence': 60
    },
    hintCooldowns: {
      'triple-code-entry': 60,
      'button-spam-sequence': 10,
      'countdown-escape': 5,
      'victory-sequence': 0
    }
  },

  metadata: {
    difficulty: 3,
    estimatedTime: 8,
    minPlayers: 1,
    maxPlayers: 4,
    tags: ['finale', 'destruction', 'codes', 'countdown', 'victory']
  }
};

export default finalDestructionConfig;