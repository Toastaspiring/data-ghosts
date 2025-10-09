import { useEffect, useRef, useState } from "react";
import { useAudioManager } from "@/hooks/useAudioManager";
import { audioManager } from "@/lib/audioManager";

interface AudioVisualizerProps {
  barCount?: number;
  className?: string;
  barHeight?: number;
  barWidth?: number;
  barGap?: number;
  fullHeight?: boolean;
  mirrored?: boolean;
}

export const AudioVisualizer = ({
  barCount = 32,
  className = "",
  barHeight = 60,
  barWidth = 4,
  barGap = 2,
  fullHeight = false,
  mirrored = false,
}: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const lastMusicRef = useRef<HTMLAudioElement | null>(null);
  const initAttempted = useRef<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const { isAudioUnlocked } = useAudioManager();

  // Connect to the background music audio - try regardless of unlock state
  useEffect(() => {
    // Always attempt connection on mount, don't wait for unlock state
    console.log("� AudioVisualizer effect triggered, attempting connection...");
    initAttempted.current = true;
    
    const timer = setTimeout(() => {
      scanForPlayingAudio();
    }, 200); // Shorter delay

    return () => {
      clearTimeout(timer);
    };
  }, []); // Remove dependency on isAudioUnlocked

  // Also try when unlock state changes (as backup)
  useEffect(() => {
    if (isAudioUnlocked && !isConnected) {
      console.log("🔓 Audio state changed to unlocked, attempting connection...");
      const timer = setTimeout(() => {
        scanForPlayingAudio();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isAudioUnlocked, isConnected]);

  // Force fresh initialization on mount - scan for any playing music
  useEffect(() => {
    console.log("🚀 AudioVisualizer mounted, scanning for audio...");
    
    const initializeVisualizer = () => {
      console.log("🔄 Initializing visualizer with fresh state...");
      
      // Reset all state
      setIsConnected(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      analyserRef.current = null;
      lastMusicRef.current = null;
      initAttempted.current = false;

      console.log("🧹 State reset complete, starting audio scan...");
      // Scan for any playing audio
      scanForPlayingAudio();
    };

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(initializeVisualizer, 100);
    
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  const scanForPlayingAudio = () => {
    console.log("🔍 Scanning for playing audio...");
    
    // Check if audio is unlocked
    const isUnlocked = audioManager.getIsUnlocked();
    const audioContext = audioManager.getAudioContext();
    console.log("🔓 Audio unlocked:", isUnlocked);
    console.log("🎧 Audio context state:", audioContext?.state);
    
    // Try to unlock if not unlocked yet - be more aggressive
    if (!isUnlocked) {
      console.log("❌ Audio not unlocked yet, attempting to unlock...");
      try {
        audioManager.unlockAudio();
        console.log("🔓 Called audio unlock, retrying scan in 300ms...");
        setTimeout(scanForPlayingAudio, 300);
      } catch (error) {
        console.log("❌ Failed to unlock audio:", error);
        // Keep trying every second
        setTimeout(scanForPlayingAudio, 1000);
      }
      return;
    }
    
    // Check if audio context is suspended (happens when navigating away)
    if (audioContext && audioContext.state === 'suspended') {
      console.log("⏸️ Audio context is suspended, attempting to resume...");
      audioContext.resume().then(() => {
        console.log("▶️ Audio context resumed successfully");
        // Try scanning again after resuming
        setTimeout(scanForPlayingAudio, 200);
      }).catch(error => {
        console.log("❌ Failed to resume audio context:", error);
        // Keep trying
        setTimeout(scanForPlayingAudio, 1000);
      });
      return;
    }

    // Check for background music
    const backgroundMusic = audioManager.getBackgroundMusic();
    const mediaSource = audioManager.getMediaSource();
    
    console.log("🎵 Background music:", backgroundMusic ? "found" : "not found");
    console.log("🎧 Audio context:", audioContext ? "available" : "not available");
    console.log("📡 Media source:", mediaSource ? "available" : "not available");
    
    if (backgroundMusic) {
      console.log("🎶 Music state - paused:", backgroundMusic.paused, "currentTime:", backgroundMusic.currentTime, "volume:", backgroundMusic.volume);
    }
    
    if (backgroundMusic && !backgroundMusic.paused && audioContext) {
      console.log("✅ Found playing background music, attempting connection");
      connectToAudio();
    } else if (backgroundMusic && audioContext && mediaSource) {
      // Even if music is paused, if we have all components, try to connect
      console.log("🎵 Found background music (may be paused), but have all components - attempting connection");
      connectToAudio();
    } else {
      console.log("⏳ No playing audio found, will retry when audio becomes available");
      
      // More aggressive retry strategy
      if (audioContext) {
        console.log("🔄 Have audio context, retrying in 500ms...");
        setTimeout(scanForPlayingAudio, 500);
      } else {
        console.log("🔄 No audio context yet, retrying in 1 second...");
        setTimeout(scanForPlayingAudio, 1000);
      }
    }
  };

  // Monitor for background music changes and reconnect if needed
  useEffect(() => {
    // Don't depend on isAudioUnlocked state, always monitor
    const checkMusicChange = setInterval(() => {
      const currentMusic = audioManager.getBackgroundMusic();
      const isUnlocked = audioManager.getIsUnlocked();
      
      // If we have music but aren't connected, try to connect
      if (currentMusic && !isConnected && isUnlocked) {
        console.log("Found background music, attempting to connect");
        connectToAudio();
        return;
      }
      
      // If music changed, reconnect
      if (currentMusic !== lastMusicRef.current && currentMusic && isUnlocked) {
        console.log("Background music changed, reconnecting visualizer");
        lastMusicRef.current = currentMusic;
        setIsConnected(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        analyserRef.current = null;
        
        // Reconnect after a short delay
        setTimeout(connectToAudio, 300);
      }
      
      // If not unlocked, keep trying to unlock
      if (!isUnlocked && currentMusic) {
        console.log("🔄 Music available but audio not unlocked, attempting unlock...");
        audioManager.unlockAudio();
      }
    }, 500); // Check more frequently

    return () => clearInterval(checkMusicChange);
  }, [isConnected]); // Only depend on isConnected

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const connectToAudio = () => {
    console.log("🔌 Attempting to connect to audio...");
    
    try {
      // Clean up any existing connection first
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        console.log("🧹 Cancelled existing animation frame");
      }
      analyserRef.current = null;
      setIsConnected(false);
      
      // Get the audio context from audioManager
      const audioContext = audioManager.getAudioContext();
      const backgroundMusic = audioManager.getBackgroundMusic();
      const existingMediaSource = audioManager.getMediaSource();

      console.log("📊 Connection attempt - Context:", !!audioContext, "Music:", !!backgroundMusic, "MediaSource:", !!existingMediaSource);

      if (!audioContext || !backgroundMusic) {
        console.log("❌ Missing audio context or background music, retrying in 1 second...");
        setTimeout(connectToAudio, 1000);
        return;
      }

      console.log("🎛️ Creating analyser node...");
      // Create a fresh analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      console.log("✅ Analyser created with FFT size:", analyser.fftSize);

      // Use existing media source if available, don't create new one
      if (existingMediaSource) {
        console.log("🔗 Connecting to existing media source...");
        // Connect existing source to our analyser
        existingMediaSource.connect(analyser);
        console.log("✅ Connected to existing media source successfully");
      } else {
        console.log("❌ No existing media source available, retrying in 2 seconds...");
        setTimeout(connectToAudio, 2000);
        return;
      }

      analyserRef.current = analyser;
      lastMusicRef.current = backgroundMusic;
      setIsConnected(true);

      console.log("🎉 Visualizer connected successfully! Starting animation...");

      // Start visualization
      animate();
    } catch (error) {
      console.error("💥 Error connecting to audio:", error);
      // Retry connection after error
      setTimeout(connectToAudio, 2000);
    }
  };

  const animate = () => {
    if (!analyserRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a fresh data array for this frame
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const totalWidth = fullHeight ? canvas.width : barCount * (barWidth + barGap) - barGap;
    const startX = fullHeight ? 0 : (canvas.width - totalWidth) / 2;
    const actualBarWidth = fullHeight ? (totalWidth / barCount) - barGap : barWidth;
    const actualBarGap = fullHeight ? barGap : barGap;

    // Draw bars
    const effectiveBarCount = mirrored ? Math.floor(barCount / 2) : barCount;
    
    for (let i = 0; i < effectiveBarCount; i++) {
      // Map frequency data to bar height
      const dataIndex = Math.floor((i / effectiveBarCount) * dataArray.length);
      const amplitude = dataArray[dataIndex];
      // Add minimum height (20% of max) plus the amplitude, so bars are always visible
      const minHeight = barHeight * 0.2;
      const normalizedHeight = minHeight + (amplitude / 255) * (barHeight - minHeight);

      // Calculate position for first half
      const x1 = startX + i * (actualBarWidth + actualBarGap);
      // Start from the far edge and grow toward center (inward-facing)
      const y = canvas.height - normalizedHeight;

      // Create gradient based on height - from bottom to top
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
      
      // Cyberpunk color scheme - cyan to purple based on frequency
      const hue = 180 + (i / effectiveBarCount) * 120; // From cyan (180) to purple (300)
      gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue}, 100%, 70%)`);

      // Draw first bar with glow effect
      ctx.fillStyle = gradient;
      ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
      ctx.shadowBlur = 4;
      ctx.fillRect(x1, y, actualBarWidth, normalizedHeight);

      // Add inner glow to first bar
      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, 0.6)`;
      ctx.fillRect(x1 + 0.5, y + 0.5, Math.max(0, actualBarWidth - 1), Math.max(0, normalizedHeight - 1));

      // If mirrored, draw the corresponding bar on the other half
      if (mirrored) {
        const mirrorIndex = effectiveBarCount - 1 - i;
        const x2 = startX + (effectiveBarCount + mirrorIndex) * (actualBarWidth + actualBarGap);
        
        // Draw mirrored bar with same properties
        ctx.fillStyle = gradient;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 4;
        ctx.fillRect(x2, y, actualBarWidth, normalizedHeight);

        // Add inner glow to mirrored bar
        ctx.shadowBlur = 0;
        ctx.fillStyle = `hsla(${hue}, 100%, 90%, 0.6)`;
        ctx.fillRect(x2 + 0.5, y + 0.5, Math.max(0, actualBarWidth - 1), Math.max(0, normalizedHeight - 1));
      }
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Don't wait for unlock state - always try to render and connect
  // The visualizer will show "Connecting..." until audio is available
  // if (!isAudioUnlocked) {
  //   return null;
  // }

  // Calculate canvas dimensions
  let canvasWidth, canvasHeight;
  
  if (fullHeight) {
    // For full height mode, the canvas width should span the screen height when rotated
    canvasWidth = typeof window !== 'undefined' ? window.innerHeight : 800;
    canvasHeight = barHeight; // Remove extra padding
  } else {
    canvasWidth = barCount * (barWidth + barGap) - barGap + 40;
    canvasHeight = barHeight + 20;
  }

  return (
    <div className={`audio-visualizer ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="opacity-80"
        style={{
          filter: "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))",
        }}
      />
      {!isConnected && (
        <div className="text-xs text-muted-foreground text-center mt-2 font-mono">
          Connecting to audio...
        </div>
      )}
    </div>
  );
};