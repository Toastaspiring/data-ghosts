import { RoomState } from "@/components/rooms/InteractiveRoom";

export const BaliMarineResearchRoom: RoomState = {
  id: "bali-marine",
  name: "Bali Marine Research Station",
  theme: "bg-gradient-to-b from-blue-900 to-teal-900",
  backgroundImage: "linear-gradient(135deg, #0c4a6e 0%, #0891b2 25%, #06b6d4  50%, #0891b2 75%, #0c4a6e 100%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(8, 145, 178, 0.3) 0%, transparent 50%)",
  ambientSound: "/sounds/underwater-ambience.mp3",
  elements: [
    {
      id: "microscope-station",
      name: "Digital Microscope",
      description: "High-powered microscope for examining coral samples and microorganisms",
      position: { x: 25, y: 40 },
      size: { width: 8, height: 12 },
      type: "equipment",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "pattern",
      difficulty: 2,
      rewardInfo: "Coral bleaching patterns show temperature spikes at coordinates 8°30'S 115°15'E"
    },
    {
      id: "ph-meter",
      name: "pH Testing Kit",
      description: "Measure ocean acidity levels from collected water samples",
      position: { x: 45, y: 30 },
      size: { width: 6, height: 8 },
      type: "tool",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "analysis",
      difficulty: 1,
      rewardInfo: "pH levels are dropping faster near the industrial discharge point",
      crossRoomClue: {
        roomId: "santorini-archaeological",
        clueType: "chemical-composition",
        value: "pH-7.2-industrial"
      }
    },
    {
      id: "specimen-archive",
      name: "Specimen Database",
      description: "Digital archive of collected marine specimens and their analysis",
      position: { x: 70, y: 45 },
      size: { width: 10, height: 15 },
      type: "computer",
      requiresUnlock: ["microscope-station"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "code",
      difficulty: 3,
      rewardInfo: "Species extinction rate correlates with seismic activity patterns",
      crossRoomClue: {
        roomId: "machu-picchu-conservation",
        clueType: "extinction-pattern",
        value: "seismic-correlation-data"
      }
    },
    {
      id: "temperature-probe",
      name: "Ocean Temperature Probe",
      description: "Monitor real-time temperature changes in the coral reef ecosystem",
      position: { x: 15, y: 70 },
      size: { width: 7, height: 10 },
      type: "equipment",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "sequence",
      difficulty: 2,
      rewardInfo: "Temperature anomalies follow a 72-hour cycle linked to tidal patterns"
    },
    {
      id: "coral-samples",
      name: "Coral Sample Collection",
      description: "Preserved coral samples showing various stages of bleaching",
      position: { x: 85, y: 25 },
      size: { width: 9, height: 12 },
      type: "specimen",
      requiresUnlock: ["ph-meter", "temperature-probe"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "pattern",
      difficulty: 4,
      rewardInfo: "Healthy coral samples contain rare algae symbiont strain ALG-847"
    },
    {
      id: "research-notes",
      name: "Dr. Chen's Research Journal",
      description: "Detailed notes on recent marine ecosystem changes",
      position: { x: 60, y: 65 },
      size: { width: 8, height: 6 },
      type: "document",
      requiresUnlock: ["specimen-archive"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "collaboration",
      difficulty: 3,
      rewardInfo: "The ecosystem collapse follows the same pattern as the ancient civilization's decline"
    },
    {
      id: "sonar-equipment",
      name: "Underwater Sonar Array",
      description: "Map underwater geological formations and detect anomalies",
      position: { x: 35, y: 80 },
      size: { width: 12, height: 8 },
      type: "equipment",
      requiresUnlock: ["coral-samples"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "mini-game",
      difficulty: 5,
      rewardInfo: "Sonar reveals hidden chamber coordinates: 8°31'12\"S 115°14'33\"E",
      crossRoomClue: {
        roomId: "santorini-archaeological",
        clueType: "coordinates",
        value: "8°31'12\"S-115°14'33\"E"
      }
    },
    {
      id: "water-filtration",
      name: "Water Purification System",
      description: "Analyze pollutants and toxins in the water samples",
      position: { x: 55, y: 15 },
      size: { width: 10, height: 8 },
      type: "tool",
      requiresUnlock: ["research-notes"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "analysis",
      difficulty: 4,
      rewardInfo: "Toxin signature matches ancient volcanic mineral composition"
    }
  ],
  completedPuzzles: [],
  discoveredClues: [],
  progressPercentage: 0
};

export const SantoriniArchaeologicalRoom: RoomState = {
  id: "santorini-archaeological",
  name: "Santorini Archaeological Site",
  theme: "bg-gradient-to-b from-orange-900 to-red-900",
  backgroundImage: "linear-gradient(135deg, #7c2d12 0%, #ea580c 25%, #f97316 50%, #ea580c 75%, #7c2d12 100%), radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(234, 88, 12, 0.3) 0%, transparent 50%)",
  ambientSound: "/sounds/mediterranean-wind.mp3",
  elements: [
    {
      id: "dating-equipment",
      name: "Carbon Dating Lab",
      description: "Determine the age of ancient artifacts and organic materials",
      position: { x: 30, y: 35 },
      size: { width: 12, height: 10 },
      type: "equipment",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "analysis",
      difficulty: 2,
      rewardInfo: "Artifacts date to 1600 BCE - exactly when Minoan civilization collapsed"
    },
    {
      id: "pottery-fragments",
      name: "Ceramic Fragment Collection",
      description: "Broken pottery pieces with mysterious inscriptions",
      position: { x: 60, y: 50 },
      size: { width: 8, height: 8 },
      type: "artifact",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "pattern",
      difficulty: 3,
      rewardInfo: "Pottery shows Linear A script referring to 'great water rising'",
      crossRoomClue: {
        roomId: "bali-marine",
        clueType: "ancient-text",
        value: "great-water-rising-linear-a"
      }
    },
    {
      id: "ground-radar",
      name: "Ground Penetrating Radar",
      description: "Scan beneath the surface for hidden structures",
      position: { x: 20, y: 60 },
      size: { width: 10, height: 12 },
      type: "equipment",
      requiresUnlock: ["dating-equipment"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "mini-game",
      difficulty: 4,
      rewardInfo: "Hidden chamber detected 12 meters below the main temple foundation"
    },
    {
      id: "ancient-texts",
      name: "Papyrus Scroll Archive",
      description: "Collection of preserved ancient documents and scrolls",
      position: { x: 75, y: 30 },
      size: { width: 9, height: 11 },
      type: "document",
      requiresUnlock: ["pottery-fragments"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "code",
      difficulty: 4,
      rewardInfo: "Scroll describes ritual to 'calm the angry earth spirits'"
    },
    {
      id: "mineral-analyzer",
      name: "Geological Spectrometer",
      description: "Analyze the mineral composition of volcanic samples",
      position: { x: 45, y: 75 },
      size: { width: 11, height: 9 },
      type: "tool",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "sequence",
      difficulty: 2,
      rewardInfo: "Volcanic ash contains rare earth elements in specific proportions",
      crossRoomClue: {
        roomId: "machu-picchu-conservation",
        clueType: "mineral-composition",
        value: "rare-earth-elements-volcanic"
      }
    },
    {
      id: "temple-altar",
      name: "Sacred Altar Stone",
      description: "Ancient altar with carved symbols and offering channels",
      position: { x: 50, y: 20 },
      size: { width: 15, height: 12 },
      type: "artifact",
      requiresUnlock: ["ground-radar", "ancient-texts"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "collaboration",
      difficulty: 5,
      rewardInfo: "Altar alignment points to exact coordinates of the marine research anomaly"
    },
    {
      id: "seismic-data",
      name: "Ancient Seismograph",
      description: "Reconstructed device showing earthquake patterns from antiquity",
      position: { x: 80, y: 65 },
      size: { width: 8, height: 10 },
      type: "equipment",
      requiresUnlock: ["mineral-analyzer"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "pattern",
      difficulty: 3,
      rewardInfo: "Seismic patterns show cyclical disasters every 3,600 years"
    },
    {
      id: "fresco-restoration",
      name: "Digital Fresco Restoration",
      description: "Computer system for reconstructing damaged wall paintings",
      position: { x: 15, y: 25 },
      size: { width: 10, height: 8 },
      type: "computer",
      requiresUnlock: ["temple-altar"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "mini-game",
      difficulty: 4,
      rewardInfo: "Restored fresco depicts the same conservation ritual found in modern protocols"
    }
  ],
  completedPuzzles: [],
  discoveredClues: [],
  progressPercentage: 0
};

export const MachuPicchuConservationRoom: RoomState = {
  id: "machu-picchu-conservation",
  name: "Machu Picchu Conservation Lab",
  theme: "bg-gradient-to-b from-green-900 to-amber-900",
  backgroundImage: "linear-gradient(135deg, #14532d 0%, #166534 25%, #22c55e 50%, #ca8a04 75%, #92400e 100%), radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(202, 138, 4, 0.3) 0%, transparent 50%)",
  ambientSound: "/sounds/mountain-wind.mp3",
  elements: [
    {
      id: "botanical-scanner",
      name: "Plant DNA Sequencer",
      description: "Analyze genetic material from rare high-altitude plant species",
      position: { x: 25, y: 40 },
      size: { width: 10, height: 12 },
      type: "equipment",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "sequence",
      difficulty: 2,
      rewardInfo: "Ancient quinoa varieties contain genetic markers for climate adaptation"
    },
    {
      id: "soil-analyzer",
      name: "Terraced Soil Analysis Kit",
      description: "Examine soil composition from the ancient agricultural terraces",
      position: { x: 45, y: 55 },
      size: { width: 8, height: 10 },
      type: "tool",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "analysis",
      difficulty: 1,
      rewardInfo: "Soil layers reveal drought patterns matching modern climate data"
    },
    {
      id: "weather-station",
      name: "High-Altitude Weather Monitor",
      description: "Track atmospheric conditions and climate patterns",
      position: { x: 70, y: 35 },
      size: { width: 12, height: 8 },
      type: "equipment",
      requiresUnlock: ["botanical-scanner"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "pattern",
      difficulty: 3,
      rewardInfo: "Weather patterns show correlation with seismic activity cycles",
      crossRoomClue: {
        roomId: "santorini-archaeological",
        clueType: "weather-seismic",
        value: "pattern-correlation-cycles"
      }
    },
    {
      id: "preservation-chamber",
      name: "Artifact Preservation Unit",
      description: "Climate-controlled storage for delicate archaeological finds",
      position: { x: 20, y: 70 },
      size: { width: 11, height: 9 },
      type: "equipment",
      requiresUnlock: ["soil-analyzer"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "mini-game",
      difficulty: 3,
      rewardInfo: "Preserved textiles show the same weaving pattern as marine algae structure"
    },
    {
      id: "satellite-link",
      name: "Global Monitoring Network",
      description: "Communication hub linking all research stations worldwide",
      position: { x: 60, y: 75 },
      size: { width: 13, height: 10 },
      type: "computer",
      requiresUnlock: ["weather-station", "preservation-chamber"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "collaboration",
      difficulty: 5,
      rewardInfo: "Global data shows synchronized environmental anomalies across all sites"
    },
    {
      id: "water-system",
      name: "Ancient Aqueduct Model",
      description: "3D reconstruction of the Incan water management system",
      position: { x: 80, y: 60 },
      size: { width: 9, height: 12 },
      type: "tool",
      isUnlocked: true,
      isSolved: false,
      puzzleType: "sequence",
      difficulty: 4,
      rewardInfo: "Water flow calculations match optimal marine current patterns"
    },
    {
      id: "ritual-calendar",
      name: "Astronomical Calendar Stone",
      description: "Ancient Incan calendar showing astronomical alignments",
      position: { x: 35, y: 20 },
      size: { width: 10, height: 8 },
      type: "artifact",
      requiresUnlock: ["satellite-link"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "code",
      difficulty: 4,
      rewardInfo: "Calendar predicts the next convergence event in 72 hours",
      crossRoomClue: {
        roomId: "bali-marine",
        clueType: "timing",
        value: "convergence-72-hours"
      }
    },
    {
      id: "conservation-protocols",
      name: "Emergency Protocol Database",
      description: "Modern conservation strategies based on ancient knowledge",
      position: { x: 50, y: 15 },
      size: { width: 12, height: 7 },
      type: "document",
      requiresUnlock: ["water-system", "ritual-calendar"],
      isUnlocked: false,
      isSolved: false,
      puzzleType: "collaboration",
      difficulty: 5,
      rewardInfo: "Final protocol requires synchronized action across all three locations"
    }
  ],
  completedPuzzles: [],
  discoveredClues: [],
  progressPercentage: 0
};