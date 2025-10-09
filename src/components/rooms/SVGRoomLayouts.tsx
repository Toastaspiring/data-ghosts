import { InteractiveElement } from "@/components/rooms/InteractiveRoom";
import { 
  Microscope, 
  FileText, 
  TestTube, 
  Monitor, 
  Wrench, 
  Zap,
  Database,
  Thermometer,
  FlaskConical,
  BookOpen,
  Radar,
  Droplets,
  Mountain,
  Satellite,
  Calendar,
  Shield,
  Lock,
  Check
} from "lucide-react";

interface SVGRoomProps {
  roomId: string;
  elements: InteractiveElement[];
  onElementClick: (element: InteractiveElement) => void;
}

// Function to get the appropriate icon component for each element
const getEquipmentIcon = (element: InteractiveElement) => {
  const iconProps = { size: 32, className: "text-current" };
  
  // Specific equipment mapping
  if (element.id === "microscope-station") return <Microscope {...iconProps} />;
  if (element.id === "ph-meter") return <Droplets {...iconProps} />;
  if (element.id === "specimen-archive") return <Database {...iconProps} />;
  if (element.id === "temperature-probe") return <Thermometer {...iconProps} />;
  if (element.id === "coral-samples") return <FlaskConical {...iconProps} />;
  if (element.id === "research-notes") return <FileText {...iconProps} />;
  if (element.id === "sonar-equipment") return <Radar {...iconProps} />;
  if (element.id === "water-filtration") return <Shield {...iconProps} />;
  
  if (element.id === "dating-equipment") return <Zap {...iconProps} />;
  if (element.id === "pottery-fragments") return <TestTube {...iconProps} />;
  if (element.id === "ground-radar") return <Radar {...iconProps} />;
  if (element.id === "ancient-texts") return <BookOpen {...iconProps} />;
  if (element.id === "mineral-analyzer") return <FlaskConical {...iconProps} />;
  if (element.id === "temple-altar") return <Mountain {...iconProps} />;
  if (element.id === "seismic-data") return <Zap {...iconProps} />;
  if (element.id === "fresco-restoration") return <Monitor {...iconProps} />;
  
  if (element.id === "botanical-scanner") return <Microscope {...iconProps} />;
  if (element.id === "soil-analyzer") return <TestTube {...iconProps} />;
  if (element.id === "weather-station") return <Satellite {...iconProps} />;
  if (element.id === "preservation-chamber") return <Shield {...iconProps} />;
  if (element.id === "satellite-link") return <Satellite {...iconProps} />;
  if (element.id === "water-system") return <Droplets {...iconProps} />;
  if (element.id === "ritual-calendar") return <Calendar {...iconProps} />;
  if (element.id === "conservation-protocols") return <FileText {...iconProps} />;
  
  // Fallback by type
  switch (element.type) {
    case 'equipment': return <Microscope {...iconProps} />;
    case 'document': return <FileText {...iconProps} />;
    case 'specimen': return <TestTube {...iconProps} />;
    case 'computer': return <Monitor {...iconProps} />;
    case 'tool': return <Wrench {...iconProps} />;
    case 'artifact': return <Mountain {...iconProps} />;
    default: return <Zap {...iconProps} />;
  }
};

export const BaliMarineRoomSVG = ({ elements, onElementClick }: SVGRoomProps) => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 1920 1080" className="w-full h-full">
        {/* Room Background */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="25%" stopColor="#0891b2" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="75%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          
          <radialGradient id="bubbleEffect" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Water ripple effect */}
          <pattern id="waterPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="30" r="2" fill="rgba(34, 197, 94, 0.2)">
              <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="60" r="1.5" fill="rgba(6, 182, 212, 0.3)">
              <animate attributeName="r" values="0.5;2;0.5" dur="4s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>
        
        {/* Ocean floor background */}
        <rect width="1920" height="1080" fill="url(#oceanGradient)" />
        <rect width="1920" height="1080" fill="url(#waterPattern)" opacity="0.3" />
        
        {/* Underwater lab structure */}
        <g className="lab-structure">
          {/* Main lab dome */}
          <ellipse cx="960" cy="540" rx="400" ry="200" 
                   fill="rgba(15, 23, 42, 0.8)" 
                   stroke="#06b6d4" 
                   strokeWidth="3" 
                   opacity="0.9" />
          
          {/* Lab windows */}
          <circle cx="760" cy="480" r="60" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="1160" cy="480" r="60" fill="rgba(6, 182, 212, 0.2)" stroke="#06b6d4" strokeWidth="2" />
          
          {/* Equipment tables */}
          <rect x="600" y="600" width="120" height="80" rx="10" 
                fill="rgba(30, 41, 59, 0.9)" stroke="#0891b2" strokeWidth="2" />
          <rect x="1200" y="600" width="120" height="80" rx="10" 
                fill="rgba(30, 41, 59, 0.9)" stroke="#0891b2" strokeWidth="2" />
          
          {/* Central workstation */}
          <ellipse cx="960" cy="650" rx="150" ry="80" 
                   fill="rgba(30, 41, 59, 0.9)" 
                   stroke="#06b6d4" 
                   strokeWidth="2" />
        </g>
        
        {/* Floating particles/bubbles */}
        <g className="particles">
          <circle cx="300" cy="200" r="3" fill="rgba(34, 197, 94, 0.6)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-20; 0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1500" cy="300" r="2" fill="rgba(6, 182, 212, 0.5)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-15; 0,0"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="200" cy="800" r="4" fill="rgba(8, 145, 178, 0.4)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-25; 0,0"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Interactive equipment elements */}
        {elements.map((element) => {
          const x = (element.position.x / 100) * 1920;
          const y = (element.position.y / 100) * 1080;
          const width = (element.size.width / 100) * 1920;
          const height = (element.size.height / 100) * 1080;
          
          return (
            <g key={element.id}>
              {/* Equipment base */}
              <rect
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                rx="8"
                fill={element.isUnlocked ? 
                  (element.isSolved ? "rgba(34, 197, 94, 0.3)" : "rgba(6, 182, 212, 0.4)") : 
                  "rgba(239, 68, 68, 0.3)"
                }
                stroke={element.isUnlocked ? 
                  (element.isSolved ? "#22c55e" : "#06b6d4") : 
                  "#ef4444"
                }
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] hover:brightness-125 hover:scale-105"
                style={{ filter: element.isUnlocked && !element.isSolved ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' : '' }}
                onClick={() => onElementClick(element)}
              >
                {!element.isSolved && element.isUnlocked && (
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                )}
              </rect>
              
              {/* Equipment icon */}
              <foreignObject
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className={`mb-1 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-400" : "text-cyan-400") : 
                    "text-red-400"
                  } ${!element.isSolved && element.isUnlocked ? "animate-pulse" : ""}`}>
                    {getEquipmentIcon(element)}
                  </div>
                  <div className={`text-xs font-bold text-center px-2 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-300" : "text-cyan-300") : 
                    "text-red-300"
                  }`}>
                    {element.name}
                  </div>
                </div>
              </foreignObject>
              
              {/* Status indicators */}
              {!element.isUnlocked && (
                <foreignObject x={x - 30} y={y + height/2 + 10} width="60" height="30">
                  <div className="flex items-center justify-center">
                    <Lock size={16} className="text-red-400 mr-1" />
                    <span className="text-red-400 text-xs font-mono">LOCKED</span>
                  </div>
                </foreignObject>
              )}
              
              {element.isSolved && (
                <foreignObject x={x + width/2 - 25} y={y - height/2 + 5} width="30" height="30">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const SantoriniArchaeologicalRoomSVG = ({ elements, onElementClick }: SVGRoomProps) => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 1920 1080" className="w-full h-full">
        <defs>
          <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="25%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          
          <pattern id="stonePattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="#92400e" opacity="0.3" />
            <rect x="10" y="10" width="30" height="30" fill="#a16207" opacity="0.2" />
          </pattern>
        </defs>
        
        {/* Ancient site background */}
        <rect width="1920" height="1080" fill="url(#sunsetGradient)" />
        
        {/* Ancient ruins structure */}
        <g className="ruins-structure">
          {/* Main temple foundation */}
          <rect x="660" y="740" width="600" height="200" 
                fill="url(#stonePattern)" 
                stroke="#ea580c" 
                strokeWidth="2" />
          
          {/* Columns */}
          <rect x="720" y="540" width="40" height="200" fill="#92400e" stroke="#a16207" strokeWidth="2" />
          <rect x="860" y="540" width="40" height="200" fill="#92400e" stroke="#a16207" strokeWidth="2" />
          <rect x="1000" y="540" width="40" height="200" fill="#92400e" stroke="#a16207" strokeWidth="2" />
          <rect x="1140" y="540" width="40" height="200" fill="#92400e" stroke="#a16207" strokeWidth="2" />
          
          {/* Excavation pits */}
          <ellipse cx="400" cy="700" rx="100" ry="60" 
                   fill="rgba(124, 45, 18, 0.6)" 
                   stroke="#ea580c" 
                   strokeWidth="2" />
          <ellipse cx="1520" cy="700" rx="100" ry="60" 
                   fill="rgba(124, 45, 18, 0.6)" 
                   stroke="#ea580c" 
                   strokeWidth="2" />
          
          {/* Work tables */}
          <rect x="300" y="400" width="150" height="100" rx="10" 
                fill="rgba(146, 64, 14, 0.8)" stroke="#ea580c" strokeWidth="2" />
          <rect x="1470" y="400" width="150" height="100" rx="10" 
                fill="rgba(146, 64, 14, 0.8)" stroke="#ea580c" strokeWidth="2" />
        </g>
        
        {/* Floating dust particles */}
        <g className="dust-particles">
          <circle cx="500" cy="300" r="1" fill="rgba(251, 146, 60, 0.6)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 20,0; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1200" cy="250" r="1.5" fill="rgba(234, 88, 12, 0.5)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -15,5; 0,0"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Interactive elements */}
        {elements.map((element) => {
          const x = (element.position.x / 100) * 1920;
          const y = (element.position.y / 100) * 1080;
          const width = (element.size.width / 100) * 1920;
          const height = (element.size.height / 100) * 1080;
          
          return (
            <g key={element.id}>
              <rect
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                rx="8"
                fill={element.isUnlocked ? 
                  (element.isSolved ? "rgba(34, 197, 94, 0.3)" : "rgba(251, 146, 60, 0.4)") : 
                  "rgba(239, 68, 68, 0.3)"
                }
                stroke={element.isUnlocked ? 
                  (element.isSolved ? "#22c55e" : "#fb923c") : 
                  "#ef4444"
                }
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(251,146,60,0.8)] hover:brightness-125 hover:scale-105"
                style={{ filter: element.isUnlocked && !element.isSolved ? 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.5))' : '' }}
                onClick={() => onElementClick(element)}
              >
                {!element.isSolved && element.isUnlocked && (
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                )}
              </rect>
              
              <foreignObject
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className={`mb-1 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-400" : "text-orange-400") : 
                    "text-red-400"
                  } ${!element.isSolved && element.isUnlocked ? "animate-pulse" : ""}`}>
                    {getEquipmentIcon(element)}
                  </div>
                  <div className={`text-xs font-bold text-center px-2 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-300" : "text-orange-300") : 
                    "text-red-300"
                  }`}>
                    {element.name}
                  </div>
                </div>
              </foreignObject>
              
              {!element.isUnlocked && (
                <foreignObject x={x - 30} y={y + height/2 + 10} width="60" height="30">
                  <div className="flex items-center justify-center">
                    <Lock size={16} className="text-red-400 mr-1" />
                    <span className="text-red-400 text-xs font-mono">LOCKED</span>
                  </div>
                </foreignObject>
              )}
              
              {element.isSolved && (
                <foreignObject x={x + width/2 - 25} y={y - height/2 + 5} width="30" height="30">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const MachuPicchuConservationRoomSVG = ({ elements, onElementClick }: SVGRoomProps) => {
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 1920 1080" className="w-full h-full">
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="25%" stopColor="#166534" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          
          <pattern id="leafPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="rgba(34, 197, 94, 0.3)" />
            <circle cx="60" cy="60" r="1.5" fill="rgba(202, 138, 4, 0.3)" />
          </pattern>
        </defs>
        
        {/* Mountain lab background */}
        <rect width="1920" height="1080" fill="url(#mountainGradient)" />
        <rect width="1920" height="1080" fill="url(#leafPattern)" opacity="0.4" />
        
        {/* Lab structure */}
        <g className="lab-structure">
          {/* Main building */}
          <rect x="760" y="640" width="400" height="300" rx="20" 
                fill="rgba(20, 83, 45, 0.8)" 
                stroke="#22c55e" 
                strokeWidth="3" />
          
          {/* Terraced platforms */}
          <rect x="300" y="800" width="200" height="80" rx="10" 
                fill="rgba(22, 101, 52, 0.7)" stroke="#16a34a" strokeWidth="2" />
          <rect x="1420" y="800" width="200" height="80" rx="10" 
                fill="rgba(22, 101, 52, 0.7)" stroke="#16a34a" strokeWidth="2" />
          
          {/* Conservation equipment areas */}
          <circle cx="450" cy="500" r="80" 
                  fill="rgba(20, 83, 45, 0.6)" 
                  stroke="#22c55e" 
                  strokeWidth="2" />
          <circle cx="1470" cy="500" r="80" 
                  fill="rgba(20, 83, 45, 0.6)" 
                  stroke="#22c55e" 
                  strokeWidth="2" />
          
          {/* Central analysis station */}
          <polygon points="960,400 1100,500 960,600 820,500" 
                   fill="rgba(20, 83, 45, 0.8)" 
                   stroke="#22c55e" 
                   strokeWidth="2" />
        </g>
        
        {/* Floating spores/particles */}
        <g className="nature-particles">
          <circle cx="200" cy="200" r="2" fill="rgba(34, 197, 94, 0.7)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 10,-10; 0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1600" cy="300" r="1.5" fill="rgba(202, 138, 4, 0.6)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -8,8; 0,0"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Interactive elements */}
        {elements.map((element) => {
          const x = (element.position.x / 100) * 1920;
          const y = (element.position.y / 100) * 1080;
          const width = (element.size.width / 100) * 1920;
          const height = (element.size.height / 100) * 1080;
          
          return (
            <g key={element.id}>
              <rect
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                rx="8"
                fill={element.isUnlocked ? 
                  (element.isSolved ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.4)") : 
                  "rgba(239, 68, 68, 0.3)"
                }
                stroke={element.isUnlocked ? 
                  (element.isSolved ? "#22c55e" : "#22c55e") : 
                  "#ef4444"
                }
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] hover:brightness-125 hover:scale-105"
                style={{ filter: element.isUnlocked && !element.isSolved ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))' : '' }}
                onClick={() => onElementClick(element)}
              >
                {!element.isSolved && element.isUnlocked && (
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                )}
              </rect>
              
              <foreignObject
                x={x - width/2}
                y={y - height/2}
                width={width}
                height={height}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <div className={`mb-1 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-400" : "text-green-400") : 
                    "text-red-400"
                  } ${!element.isSolved && element.isUnlocked ? "animate-pulse" : ""}`}>
                    {getEquipmentIcon(element)}
                  </div>
                  <div className={`text-xs font-bold text-center px-2 ${element.isUnlocked ? 
                    (element.isSolved ? "text-green-300" : "text-green-300") : 
                    "text-red-300"
                  }`}>
                    {element.name}
                  </div>
                </div>
              </foreignObject>
              
              {!element.isUnlocked && (
                <foreignObject x={x - 30} y={y + height/2 + 10} width="60" height="30">
                  <div className="flex items-center justify-center">
                    <Lock size={16} className="text-red-400 mr-1" />
                    <span className="text-red-400 text-xs font-mono">LOCKED</span>
                  </div>
                </foreignObject>
              )}
              
              {element.isSolved && (
                <foreignObject x={x + width/2 - 25} y={y - height/2 + 5} width="30" height="30">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-1">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};