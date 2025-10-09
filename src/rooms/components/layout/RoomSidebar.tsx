import React, { useState } from 'react';
import { Book, Package, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Clue, InventoryItem } from '../../core/types';

interface RoomSidebarProps {
  clues: Clue[];
  inventory: InventoryItem[];
  progress: {
    percentage: number;
    completed: number;
    total: number;
    timeElapsed: number;
  };
  hints: string[];
  className?: string;
}

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  clues,
  inventory,
  progress,
  hints,
  className
}) => {
  const [expandedSections, setExpandedSections] = useState({
    clues: true,
    inventory: true,
    hints: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className={cn(
      "w-80 bg-background/95 backdrop-blur-sm border-l border-primary/20",
      "shadow-[0_0_20px_rgba(0,255,255,0.1)] relative",
      className
    )}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          {/* Clues Section */}
          <Collapsible 
            open={expandedSections.clues}
            onOpenChange={() => toggleSection('clues')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm font-semibold neon-cyan">
                    Investigation Clues
                  </span>
                  <Badge variant="outline" className="neon-border">
                    {clues.length}
                  </Badge>
                </div>
                {expandedSections.clues ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {clues.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No clues discovered yet...
                </p>
              ) : (
                clues.map((clue, index) => (
                  <div
                    key={`${clue.id}-${index}`}
                    className={cn(
                      "p-3 bg-background/50 backdrop-blur-sm rounded-md",
                      "border border-primary/20 neon-border-subtle",
                      "hover:bg-primary/5 transition-colors duration-300"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-mono text-sm font-semibold text-primary">
                          {clue.title || `Clue ${index + 1}`}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            clue.type === 'shared' && "bg-accent/20 text-accent",
                            clue.type === 'crossRoom' && "bg-destructive/20 text-destructive"
                          )}
                        >
                          {clue.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/90">
                        {clue.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Found: {new Date(clue.discoveredAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Inventory Section */}
          <Collapsible 
            open={expandedSections.inventory}
            onOpenChange={() => toggleSection('inventory')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  <span className="font-mono text-sm font-semibold neon-cyan">
                    Evidence Inventory
                  </span>
                  <Badge variant="outline" className="neon-border">
                    {inventory.length}
                  </Badge>
                </div>
                {expandedSections.inventory ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {inventory.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No evidence collected yet...
                </p>
              ) : (
                inventory.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={cn(
                      "p-3 bg-background/50 backdrop-blur-sm rounded-md",
                      "border border-accent/20 neon-border-subtle",
                      "hover:bg-accent/5 transition-colors duration-300"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-mono text-sm font-semibold text-accent">
                          {item.name}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/90">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Source: {item.obtainedFrom}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Hints Section */}
          {hints.length > 0 && (
            <Collapsible 
              open={expandedSections.hints}
              onOpenChange={() => toggleSection('hints')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="font-mono text-sm font-semibold neon-cyan">
                      Available Hints
                    </span>
                    <Badge variant="outline" className="neon-border">
                      {hints.length}
                    </Badge>
                  </div>
                  {expandedSections.hints ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {hints.map((hint, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 bg-background/50 backdrop-blur-sm rounded-md",
                      "border border-yellow-400/20 neon-border-subtle",
                      "hover:bg-yellow-400/5 transition-colors duration-300"
                    )}
                  >
                    <p className="text-sm text-foreground/90">
                      {hint}
                    </p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>

      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-transparent pointer-events-none" />
    </aside>
  );
};

export default RoomSidebar;