import { Button, ButtonProps } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { SoundEffect } from "@/config/sounds";

interface AudioButtonProps extends ButtonProps {
  clickSound?: SoundEffect;
  hoverSound?: SoundEffect;
}

export const AudioButton = ({ 
  clickSound = "buttonClick", 
  hoverSound,
  onClick,
  onMouseEnter,
  children,
  ...props 
}: AudioButtonProps) => {
  const { playSound } = useAudio();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(clickSound);
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hoverSound) {
      playSound(hoverSound);
    }
    onMouseEnter?.(e);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Button>
  );
};
