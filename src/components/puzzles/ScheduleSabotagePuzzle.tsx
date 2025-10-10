import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingDown, Users } from "lucide-react";

interface Post {
  id: number;
  title: string;
  currentTime: string;
  audiencePeak: string;
  engagement: number;
}

interface ScheduleSabotagePuzzleProps {
  posts: Post[];
  targetEngagementDrop: number;
  onSolve: () => void;
}

export const ScheduleSabotagePuzzle = ({ 
  posts: initialPosts, 
  targetEngagementDrop,
  onSolve 
}: ScheduleSabotagePuzzleProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const timeSlots = [
    { time: "02:00", label: "2 AM", activity: 5 },
    { time: "05:00", label: "5 AM", activity: 8 },
    { time: "09:00", label: "9 AM", activity: 45 },
    { time: "12:00", label: "12 PM", activity: 70 },
    { time: "15:00", label: "3 PM", activity: 55 },
    { time: "18:00", label: "6 PM", activity: 85 },
    { time: "21:00", label: "9 PM", activity: 95 },
    { time: "23:00", label: "11 PM", activity: 60 },
  ];

  const reschedulePost = (postId: number, newTime: string) => {
    // Check if time slot is already taken by another post
    const isTimeTaken = posts.some(post => post.id !== postId && post.currentTime === newTime);
    if (isTimeTaken) return; // Don't allow scheduling at same time
    
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, currentTime: newTime } : post
    ));
  };
  
  const isTimeSlotTaken = (time: string, currentPostId: number) => {
    return posts.some(post => post.id !== currentPostId && post.currentTime === time);
  };

  const calculateEngagementDrop = () => {
    let totalDrop = 0;
    posts.forEach(post => {
      const scheduledSlot = timeSlots.find(slot => slot.time === post.currentTime);
      const optimalSlot = timeSlots.find(slot => slot.time === post.audiencePeak);
      
      if (scheduledSlot && optimalSlot) {
        const dropPercent = ((optimalSlot.activity - scheduledSlot.activity) / optimalSlot.activity) * 100;
        totalDrop += Math.max(0, dropPercent);
      }
    });
    return Math.round(totalDrop / posts.length);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const avgDrop = calculateEngagementDrop();
    
    if (avgDrop >= targetEngagementDrop) {
      setTimeout(() => onSolve(), 1500);
    }
  };

  const avgDrop = calculateEngagementDrop();

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          Sabotage du Planning
        </h2>
        <p className="text-muted-foreground">
          Reprogrammez les posts aux pires horaires pour tuer leur engagement
        </p>
        <p className="text-xs text-destructive">
          ⚠️ Chaque créneau horaire ne peut accueillir qu'un seul post
        </p>
        <Badge variant={avgDrop >= targetEngagementDrop ? "default" : "destructive"}>
          Baisse: {avgDrop}% / {targetEngagementDrop}%
        </Badge>
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30">
        <h3 className="font-bold text-accent mb-3">📊 Activité de l'Audience</h3>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((slot) => (
            <div key={slot.time} className="text-center p-2 bg-muted rounded">
              <div className="text-xs text-muted-foreground">{slot.label}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Users className="w-3 h-3" />
                <span className="text-sm font-bold">{slot.activity}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {posts.map((post) => {
          const isSelected = selectedPost === post.id;
          const currentSlot = timeSlots.find(s => s.time === post.currentTime);
          const optimalSlot = timeSlots.find(s => s.time === post.audiencePeak);
          const isSabotaged = currentSlot && optimalSlot && currentSlot.activity < optimalSlot.activity * 0.5;
          
          return (
            <Card
              key={post.id}
              className={`p-4 transition-all ${
                isSelected ? "border-primary bg-primary/10" : ""
              } ${
                submitted && isSabotaged ? "border-green-500 bg-green-500/10" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold">{post.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Programmé: {post.currentTime}</span>
                      <span className="text-primary">• Pic: {post.audiencePeak}</span>
                    </div>
                  </div>
                  <Badge variant={isSabotaged ? "default" : "outline"}>
                    {currentSlot?.activity}% activité
                  </Badge>
                </div>

                {isSelected && (
                  <div className="grid grid-cols-4 gap-2 animate-fade-in">
                    {timeSlots.map((slot) => {
                      const isTaken = isTimeSlotTaken(slot.time, post.id);
                      const isCurrent = post.currentTime === slot.time;
                      
                      return (
                        <Button
                          key={slot.time}
                          size="sm"
                          variant={isCurrent ? "default" : isTaken ? "destructive" : "outline"}
                          onClick={() => reschedulePost(post.id, slot.time)}
                          className="h-auto py-2 flex flex-col relative"
                          disabled={submitted || isTaken}
                        >
                          <span className="text-xs">{slot.label}</span>
                          <span className="text-[10px] opacity-70">{slot.activity}%</span>
                          {isTaken && <span className="text-[10px] absolute top-0.5 right-0.5">🔒</span>}
                        </Button>
                      );
                    })}
                  </div>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPost(isSelected ? null : post.id)}
                  className="w-full"
                  disabled={submitted}
                >
                  {isSelected ? "Fermer" : "Reprogrammer"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {submitted && (
        <Card className="p-4 bg-muted/50 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <TrendingDown className="w-5 h-5" />
            <p className="font-bold">Engagement réduit de {avgDrop}%</p>
          </div>
          {avgDrop >= targetEngagementDrop ? (
            <p className="text-green-500">✅ Planning saboté avec succès!</p>
          ) : (
            <p className="text-red-500">❌ Pas assez de baisse (min {targetEngagementDrop}%)</p>
          )}
        </Card>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitted}
        className="w-full"
        size="lg"
      >
        {submitted ? "Sabotage Terminé" : "Valider le Planning Saboté"}
      </Button>
    </div>
  );
};