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
      dependencies: [], // All puzzles unlocked from start
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
      dependencies: [], // All puzzles unlocked from start
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
      isUnlocked: true,
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
      dependencies: [], // All puzzles unlocked from start
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
      isUnlocked: true,
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
      dependencies: [],
      rewards: [],
      isUnlocked: true,
      isSolved: false
    },

    {
      id: 'pressure-system',
      type: 'equipment',
      name: 'Pressure Calibration System',
      description: 'The deep-sea pressure control system needs calibration to prevent hull breach.',
      position: { x: 400, y: 200 },
      size: { width: 90, height: 80 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'pressure-stable',
            title: 'Pressure Stabilized',
            description: 'Hull pressure normalized - the lab is safe from external forces.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'pressure-calibration',
        type: 'pattern',
        difficulty: 3,
        timeLimit: 200,
        component: 'PressurePuzzle',
        data: {
          depth_meters: 2500,
          target_pressure_bar: 250,
          current_pressure: 180,
          adjustment_increments: [10, 25, 50],
          safety_range: { min: 245, max: 255 }
        },
        validation: {
          type: 'custom',
          validator: (pressure: number) => {
            return pressure >= 245 && pressure <= 255;
          }
        },
        hints: [
          'Target pressure should be around 250 bar at this depth.',
          'Adjust in increments to avoid overshooting.',
          'Stay within the safety range of 245-255 bar.'
        ],
        rewards: []
      }
    },

    {
      id: 'marine-database',
      type: 'computer',
      name: 'Marine Biology Database',
      description: 'Access the lab\'s extensive database of deep-sea organisms and their unique properties.',
      position: { x: 800, y: 300 },
      size: { width: 110, height: 75 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'species-identified',
            title: 'Unknown Species',
            description: 'Database reveals organisms with bioluminescent quantum properties.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'species-classification',
        type: 'logic',
        difficulty: 2,
        timeLimit: 180,
        component: 'SpeciesPuzzle',
        data: {
          organisms: [
            { name: 'Quantum Jellyfish', depth: 2500, luminescence: true, quantum: true },
            { name: 'Abyssal Squid', depth: 3000, luminescence: false, quantum: false },
            { name: 'Ghost Coral', depth: 2000, luminescence: true, quantum: true },
            { name: 'Deep Anglerfish', depth: 2800, luminescence: true, quantum: false }
          ],
          classification_criteria: ['depth', 'luminescence', 'quantum'],
          target_matches: 2
        },
        validation: {
          type: 'exact',
          correctAnswer: ['Quantum Jellyfish', 'Ghost Coral']
        },
        hints: [
          'Look for organisms with both luminescence AND quantum properties.',
          'Depth range 2000-2500m is most relevant.',
          'Two species match all criteria.'
        ],
        rewards: []
      }
    },

    {
      id: 'oxygen-management',
      type: 'equipment',
      name: 'Oxygen Level Control',
      description: 'Monitor and adjust oxygen levels throughout the lab to maintain safe conditions.',
      position: { x: 250, y: 450 },
      size: { width: 100, height: 90 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'oxygen-optimal',
            title: 'Air Quality Restored',
            description: 'Oxygen levels stabilized at optimal 21% - breathing is safe.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'oxygen-balance',
        type: 'sequence',
        difficulty: 2,
        timeLimit: 180,
        component: 'OxygenPuzzle',
        data: {
          zones: [
            { name: 'Research Area', current: 18, target: 21 },
            { name: 'Living Quarters', current: 22, target: 21 },
            { name: 'Storage', current: 19, target: 21 },
            { name: 'Exit Chamber', current: 20, target: 21 }
          ],
          tolerance: 0.5
        },
        validation: {
          type: 'custom',
          validator: (zones: any[]) => {
            return zones.every(z => Math.abs(z.level - 21) <= 0.5);
          }
        },
        hints: [
          'Adjust all zones to 21% oxygen.',
          'Use the control valves to balance levels.',
          'Tolerance is ±0.5% - be precise.'
        ],
        rewards: []
      }
    },

    {
      id: 'submarine-comms',
      type: 'equipment',
      name: 'Submarine Communication Array',
      description: 'Restore communication with the surface using the quantum entanglement transceiver.',
      position: { x: 550, y: 600 },
      size: { width: 120, height: 85 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'comms-restored',
            title: 'Surface Contact Established',
            description: 'Quantum communication link active - help is on the way.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'quantum-comms',
        type: 'code',
        difficulty: 3,
        timeLimit: 200,
        component: 'CommsPuzzle',
        data: {
          frequency_range: { min: 4.2, max: 8.7 },
          target_frequency: 6.66,
          signal_strength: 0,
          interference_patterns: [4.5, 5.8, 7.2],
          clear_channels: [6.6, 6.66, 6.7]
        },
        validation: {
          type: 'custom',
          validator: (freq: number) => {
            return Math.abs(freq - 6.66) < 0.1;
          }
        },
        hints: [
          'Scan for clear channels between interference.',
          'Target frequency is 6.66 GHz.',
          'Avoid the interference patterns at 4.5, 5.8, and 7.2.'
        ],
        rewards: []
      }
    },

    {
      id: 'deep-navigation',
      type: 'computer',
      name: 'Deep Sea Navigation Console',
      description: 'Plot an escape route through the underwater trenches using sonar mapping.',
      position: { x: 100, y: 300 },
      size: { width: 95, height: 70 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'route-plotted',
            title: 'Escape Route Found',
            description: 'Safe passage mapped through the trench system - way out is clear.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'sonar-navigation',
        type: 'spatial',
        difficulty: 3,
        timeLimit: 200,
        component: 'NavigationPuzzle',
        data: {
          grid_size: { width: 10, height: 10 },
          obstacles: [[2,3], [4,5], [6,4], [7,8], [3,7]],
          start: [0,0],
          exit: [9,9],
          max_moves: 20
        },
        validation: {
          type: 'custom',
          validator: (path: number[][]) => {
            const start = path[0];
            const end = path[path.length - 1];
            return start[0] === 0 && start[1] === 0 && end[0] === 9 && end[1] === 9;
          }
        },
        hints: [
          'Navigate from [0,0] to [9,9].',
          'Avoid the obstacle coordinates.',
          'Diagonal movements are allowed.'
        ],
        rewards: []
      }
    },

    {
      id: 'equipment-repair',
      type: 'equipment',
      name: 'Research Equipment Repair',
      description: 'Repair the damaged scanning equipment to complete the mission analysis.',
      position: { x: 350, y: 550 },
      size: { width: 85, height: 95 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'equipment-functional',
            title: 'Systems Online',
            description: 'All research equipment operational - data collection can resume.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'circuit-repair',
        type: 'pattern',
        difficulty: 2,
        timeLimit: 180,
        component: 'RepairPuzzle',
        data: {
          circuits: [
            { id: 'power', status: 'damaged', connections: ['A', 'B'] },
            { id: 'sensor', status: 'damaged', connections: ['C', 'D'] },
            { id: 'processor', status: 'ok', connections: ['E', 'F'] },
            { id: 'output', status: 'damaged', connections: ['G', 'H'] }
          ],
          repair_sequence: ['power', 'sensor', 'output']
        },
        validation: {
          type: 'exact',
          correctAnswer: ['power', 'sensor', 'output']
        },
        hints: [
          'Repair circuits in the correct order.',
          'Power must be restored first.',
          'Output comes after sensors are functional.'
        ],
        rewards: []
      }
    },

    {
      id: 'water-samples',
      type: 'specimen',
      name: 'Water Sample Analysis Station',
      description: 'Analyze water samples for quantum particle contamination levels.',
      position: { x: 650, y: 400 },
      size: { width: 105, height: 80 },
      dependencies: [],
      rewards: [
        {
          type: 'clue',
          data: {
            id: 'contamination-mapped',
            title: 'Quantum Readings',
            description: 'Water samples show 47% quantum particle density - unprecedented levels.'
          }
        }
      ],
      isUnlocked: true,
      isSolved: false,
      puzzle: {
        id: 'sample-analysis',
        type: 'analysis',
        difficulty: 2,
        timeLimit: 180,
        component: 'WaterAnalysisPuzzle',
        data: {
          samples: [
            { location: 'North', quantum_density: 0.45, salinity: 35, temp: 4 },
            { location: 'South', quantum_density: 0.52, salinity: 34, temp: 3 },
            { location: 'East', quantum_density: 0.41, salinity: 36, temp: 5 },
            { location: 'West', quantum_density: 0.49, salinity: 35, temp: 4 }
          ],
          threshold: 0.45
        },
        validation: {
          type: 'custom',
          validator: (samples: any[]) => {
            return samples.filter(s => s.quantum_density >= 0.45).length === 3;
          }
        },
        hints: [
          'Identify samples above 0.45 quantum density.',
          'Three samples exceed the threshold.',
          'South location has the highest reading.'
        ],
        rewards: []
      }
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
      'cell-pattern-analysis': 180,
      'data-decryption': 200,
      'bio-containment': 200,
      'pressure-calibration': 200,
      'species-classification': 180,
      'oxygen-balance': 180,
      'quantum-comms': 200,
      'sonar-navigation': 200,
      'circuit-repair': 180,
      'sample-analysis': 180
    },
    hintCooldowns: {
      'cell-pattern-analysis': 45,
      'data-decryption': 50,
      'bio-containment': 50,
      'pressure-calibration': 50,
      'species-classification': 45,
      'oxygen-balance': 45,
      'quantum-comms': 50,
      'sonar-navigation': 50,
      'circuit-repair': 45,
      'sample-analysis': 45
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