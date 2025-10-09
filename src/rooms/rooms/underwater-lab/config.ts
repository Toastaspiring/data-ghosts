import { RoomConfig } from '../../core/types';

export const underwaterLabConfig: RoomConfig = {
  id: 'underwater-lab',
  name: 'Deep Sea Research Station',
  description: 'A mysterious underwater laboratory where data ghosts have been detected. Investigate the abandoned research equipment and uncover the truth.',
  
  theme: {
    primary: {
      neon: '#00FFFF',
      glow: '#0080FF', 
      dark: '#001122'
    },
    environment: 'underwater',
    ambientSound: '/sounds/underwater-ambient.mp3',
    backgroundMusic: '/sounds/deep-research.mp3'
  },

  layout: {
    background: '/images/rooms/underwater-lab-bg.jpg',
    width: 1200,
    height: 800,
    zones: [
      {
        id: 'research-area',
        bounds: { x: 100, y: 100, w: 400, h: 300 },
        theme: 'research',
        interactive: true
      },
      {
        id: 'computer-station',
        bounds: { x: 600, y: 50, w: 300, h: 200 },
        theme: 'technology',
        interactive: true
      },
      {
        id: 'specimen-storage',
        bounds: { x: 50, y: 500, w: 200, h: 250 },
        theme: 'bio',
        interactive: true
      },
      {
        id: 'exit-chamber',
        bounds: { x: 900, y: 600, w: 250, h: 150 },
        theme: 'exit',
        interactive: false
      }
    ],
    effects: [
      {
        type: 'particles',
        config: {
          type: 'bubbles',
          count: 50,
          speed: 'slow'
        }
      },
      {
        type: 'ambient',
        config: {
          lighting: 'underwater',
          caustics: true
        }
      }
    ]
  },

  elements: [
    {
      id: 'microscope',
      type: 'equipment',
      name: 'Research Microscope',
      description: 'A high-tech microscope with unusual readings. The display shows strange cellular structures.',
      position: { x: 200, y: 180 },
      size: { width: 80, height: 80 },
      component: 'MicroscopeElement',
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'cell-analysis',
            title: 'Cellular Anomaly',
            description: 'The microscope reveals cells that seem to exist in quantum superposition - neither fully alive nor dead.',
            sourceElement: 'microscope'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'cell-pattern-analysis',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 300,
        component: 'PatternAnalysisPuzzle',
        data: {
          patterns: [
            { sequence: [1, 2, 1, 3, 2, 1], description: 'Cell division pattern A' },
            { sequence: [3, 1, 2, 3, 1, 2], description: 'Cell division pattern B' },
            { sequence: [2, 3, 1, 2, 3, 1], description: 'Cell division pattern C' }
          ],
          targetPattern: [1, 2, 1, 3, 2, 1, 3, 1, 2],
          instructions: 'Analyze the cell division patterns and predict the next sequence.'
        },
        validation: {
          type: 'exact',
          correctAnswer: [1, 2, 1, 3, 2, 1, 3, 1, 2]
        },
        hints: [
          'Look for repeating cycles in the patterns.',
          'Pattern A seems to be the foundation sequence.',
          'The target combines patterns in a specific order.'
        ],
        rewards: [
          {
            type: 'clue',
            data: {
              id: 'quantum-cells',
              title: 'Quantum Biology Discovery',
              description: 'These cells exist in multiple states simultaneously - a breakthrough in quantum biology that explains the data ghost phenomenon.'
            }
          },
          {
            type: 'unlock',
            elementIds: ['computer-terminal']
          }
        ]
      }
    },

    {
      id: 'computer-terminal',
      type: 'computer',
      name: 'Research Terminal',
      description: 'The main computer terminal of the lab. Multiple screens show encrypted data and strange readings.',
      position: { x: 700, y: 120 },
      size: { width: 100, height: 60 },
      component: 'ComputerTerminal',
      dependencies: ['microscope'],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'research-logs',
            title: 'Research Logs',
            description: 'Dr. Marina Depths was studying quantum entanglement in biological systems when the incident occurred.'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'data-decryption',
        type: 'code',
        difficulty: 3,
        timeLimit: 600,
        component: 'DecryptionPuzzle',
        data: {
          encryptedText: 'GSBW PUFRW UBAVFBA OYBPXRQ NAQ VFBYNGRQ',
          cipher: 'ROT13',
          context: 'Research log entry found in the system'
        },
        validation: {
          type: 'exact',
          correctAnswer: 'TALE GHOST HORIZON BLOCKED AND ISOLATED'
        },
        hints: [
          'This appears to be a simple substitution cipher.',
          'Try rotating the alphabet by a fixed number.',
          'ROT13 is a common encoding method.'
        ],
        rewards: [
          {
            type: 'clue',
            data: {
              id: 'project-ghost-horizon',
              title: 'Project Ghost Horizon',
              description: 'A classified research project studying the intersection of quantum mechanics and consciousness.'
            }
          },
          {
            type: 'unlock',
            elementIds: ['specimen-vault']
          }
        ]
      }
    },

    {
      id: 'specimen-vault',
      type: 'specimen',
      name: 'Specimen Storage Vault',
      description: 'A sealed container with bio-hazard warnings. Strange energy readings emanate from within.',
      position: { x: 120, y: 580 },
      size: { width: 90, height: 120 },
      component: 'SpecimenVault',
      dependencies: ['computer-terminal'],
      rewards: [
        {
          type: 'item',
          data: {
            id: 'quantum-sample',
            name: 'Quantum Bio-Sample',
            description: 'A sample that exists in multiple quantum states simultaneously.',
            type: 'sample'
          }
        }
      ],
      isUnlocked: false,
      isSolved: false,
      puzzle: {
        id: 'bio-containment',
        type: 'sequence',
        difficulty: 4,
        timeLimit: 450,
        component: 'ContainmentSequence',
        data: {
          steps: [
            'Initialize containment field',
            'Adjust quantum stabilizers',
            'Engage temporal locks',
            'Release specimen safely'
          ],
          sequence: ['INIT', 'QUANTUM', 'TEMPORAL', 'RELEASE'],
          safetyProtocols: true
        },
        validation: {
          type: 'exact',
          correctAnswer: ['INIT', 'QUANTUM', 'TEMPORAL', 'RELEASE']
        },
        hints: [
          'Follow the standard containment protocol.',
          'Each step must be completed in the correct order.',
          'Safety protocols cannot be bypassed.'
        ],
        rewards: [
          {
            type: 'crossRoom',
            targetRoom: 'analysis-chamber',
            clueData: {
              sourceRoom: 'underwater-lab',
              targetRoom: 'analysis-chamber',
              clueType: 'specimen',
              value: 'quantum-sample',
              description: 'A quantum bio-sample that defies conventional physics.'
            }
          },
          {
            type: 'unlock',
            elementIds: ['emergency-exit']
          }
        ]
      }
    },

    {
      id: 'emergency-exit',
      type: 'device',
      name: 'Emergency Exit Control',
      description: 'The exit chamber control panel. All systems show green - the way out is clear.',
      position: { x: 950, y: 650 },
      size: { width: 60, height: 40 },
      component: 'ExitControl',
      dependencies: ['specimen-vault'],
      rewards: [
        {
          type: 'score',
          data: { points: 500, category: 'room-completion' }
        }
      ],
      isUnlocked: false,
      isSolved: false
    }
  ],

  audio: {
    ambient: '/sounds/underwater-ambient.mp3',
    background: '/sounds/deep-research.mp3',
    effects: {
      'bubble': '/sounds/bubble.mp3',
      'computer-beep': '/sounds/computer-beep.mp3',
      'vault-open': '/sounds/vault-open.mp3',
      'success': '/sounds/puzzle-success.mp3',
      'error': '/sounds/error.mp3'
    },
    volume: {
      master: 0.8,
      ambient: 0.6,
      effects: 0.7
    }
  },

  timing: {
    totalTime: 1800, // 30 minutes
    puzzleTimeouts: {
      'cell-pattern-analysis': 300,
      'data-decryption': 600,
      'bio-containment': 450
    },
    hintCooldowns: {
      'cell-pattern-analysis': 60,
      'data-decryption': 90,
      'bio-containment': 120
    }
  },

  metadata: {
    difficulty: 3,
    estimatedTime: 25,
    minPlayers: 1,
    maxPlayers: 4,
    tags: ['underwater', 'science', 'mystery', 'quantum', 'investigation']
  }
};

export default underwaterLabConfig;