import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const AudioPermissionModal: React.FC<AudioPermissionModalProps> = ({
  isOpen,
  onAllow,
  onDeny
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-primary/30 bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Volume2 className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-mono neon-cyan">
            🎵 Welcome to Data Ghosts
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Would you like to enable background music and sound effects for the full immersive experience?
            <br />
            <span className="text-xs mt-2 block opacity-70">
              You can change this choice anytime by refreshing the page.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="text-center p-4 border border-primary/30 rounded-lg bg-primary/5">
            <Volume2 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-mono text-primary">With Audio</p>
            <p className="text-xs text-muted-foreground">Full immersive experience</p>
          </div>
          <div className="text-center p-4 border border-muted/30 rounded-lg bg-muted/5">
            <VolumeX className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-mono text-muted-foreground">Silent Mode</p>
            <p className="text-xs text-muted-foreground">Visual experience only</p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onDeny}
            className="flex-1 font-mono border-muted/30 hover:bg-muted/10"
          >
            <VolumeX className="w-4 h-4 mr-2" />
            Silent Mode
          </Button>
          <Button
            onClick={onAllow}
            className="flex-1 font-mono bg-primary hover:bg-primary/90 neon-glow"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Enable Audio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};