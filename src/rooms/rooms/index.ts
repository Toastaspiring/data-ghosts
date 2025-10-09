// Room configurations for the Insta-Vibe sabotage game
export { default as tiktokFarmConfig } from './tiktok-farm/config';
export { default as fakeScenesConfig } from './fake-scenes/config';
export { default as videoEditorsConfig } from './video-editors/config';
export { default as finalDestructionConfig } from './final-destruction/config';

// Room registry for easy access
export const roomConfigs = {
  'tiktok-farm': () => import('./tiktok-farm/config').then(m => m.default),
  'fake-scenes': () => import('./fake-scenes/config').then(m => m.default),
  'video-editors': () => import('./video-editors/config').then(m => m.default),
  'final-destruction': () => import('./final-destruction/config').then(m => m.default)
};

// Game flow configuration
export const gameFlow = {
  startRoom: 'tiktok-farm',
  roomOrder: ['tiktok-farm', 'fake-scenes', 'video-editors', 'final-destruction'],
  requirements: {
    'fake-scenes': ['tiktok-farm'], // Needs fire alarm from room 1
    'video-editors': [], // Independent access
    'final-destruction': ['tiktok-farm', 'fake-scenes', 'video-editors'] // Needs all 3 codes
  }
};

// Story introduction
export const gameIntro = {
  title: 'Mission: Détruire Insta-Vibe',
  description: `
    Trois agents infiltrent l'entreprise Insta-Vibe, célèbre pour ses influenceurs toxiques 
    et ses contenus manipulateurs. Votre mission : saboter leur production de vidéos virales 
    et détruire définitivement leurs installations.
    
    Vous devez infiltrer 4 salles dans l'ordre de votre choix :
    
    🎬 Salle 1 - La Ferme TikTok : Sabotez leur production de contenus viraux
    🎭 Salle 2 - Les Scènes Fake : Perturbez leurs faux décors et éclairages  
    🎞️ Salle 3 - Les Monteurs : Corrompez les éditeurs vidéo et sabotez leur matériel
    💥 Salle 4 - Destruction Finale : Utilisez les 3 codes pour faire exploser le bâtiment
    
    Chaque salle contient des énigmes uniques et fournit des indices utiles pour les autres.
    Attention : certaines actions dans une salle affectent les autres !
  `,
  characters: [
    {
      name: 'Agent Cyber',
      speciality: 'Piratage et systèmes informatiques',
      avatar: '/images/characters/agent-cyber.jpg'
    },
    {
      name: 'Agent Shadow',
      speciality: 'Infiltration et sabotage discret',
      avatar: '/images/characters/agent-shadow.jpg'
    },
    {
      name: 'Agent Phoenix',
      speciality: 'Destruction et évasion',
      avatar: '/images/characters/agent-phoenix.jpg'
    }
  ],
  companyImage: '/images/story/insta-vibe-building.jpg'
};