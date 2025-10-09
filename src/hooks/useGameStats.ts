import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameStats {
  activeLobbies: number;
  totalPlayers: number;
  activeGames: number;
  completedGames: number;
  isLoading: boolean;
  error: string | null;
}

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>({
    activeLobbies: 0,
    totalPlayers: 0,
    activeGames: 0,
    completedGames: 0,
    isLoading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));

      // Get all lobbies
      const { data: lobbies, error: lobbiesError } = await supabase
        .from('lobbies')
        .select('id, status, players, created_at');

      if (lobbiesError) throw lobbiesError;

      // Get completed games from leaderboard
      const { data: completedGames, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('id');

      if (leaderboardError) throw leaderboardError;

      // Calculate stats from the data
      const activeLobbies = lobbies?.filter(lobby => 
        lobby.status === 'waiting' || lobby.status === 'playing'
      ) || [];

      const activeGames = lobbies?.filter(lobby => 
        lobby.status === 'playing'
      ) || [];

      // Count total players in active lobbies
      const totalPlayers = activeLobbies.reduce((total, lobby) => {
        const players = Array.isArray(lobby.players) ? lobby.players : [];
        return total + players.length;
      }, 0);

      setStats({
        activeLobbies: activeLobbies.length,
        totalPlayers,
        activeGames: activeGames.length,
        completedGames: completedGames?.length || 0,
        isLoading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error fetching game stats:', error);
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats'
      }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscription for lobby changes
    const channel = supabase
      .channel('game-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lobbies',
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { stats, refreshStats: fetchStats };
};