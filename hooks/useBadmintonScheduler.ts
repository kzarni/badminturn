
import { useState, useCallback, useEffect } from 'react';
import { Player, PlayerStats, Settings, Game, ShuffleStrategy, BadmintonScheduler, ReigningTeam } from '../types';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useBadmintonScheduler = (): BadmintonScheduler => {
  const [players, setPlayers] = useState<Map<string, Player>>(new Map());
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map());
  const [gameQueue, setGameQueue] = useState<string[]>([]);
  const [teamQueue, setTeamQueue] = useState<Player[][]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [reigningTeam, setReigningTeam] = useState<ReigningTeam | null>(null);
  const [champion, setChampion] = useState<Player[] | null>(null);

  const [settings, setSettings] = useState<Settings>({
    winStreakThreshold: 3,
    shuffleStrategy: ShuffleStrategy.PER_GAME,
    playersPerTeam: 2,
  });

  const clearChampionshipState = useCallback((clearBadges: boolean) => {
    setReigningTeam(null);
    setChampion(null);
    if (clearBadges) {
        setPlayerStats(prev => {
            const newStats = new Map(prev);
            newStats.forEach(stats => { stats.championOfSession = false; });
            return newStats;
        });
    }
  }, []);

  const endChampionshipAndContinue = useCallback(() => {
    if (!champion) return;
    setChampion(null);
    setReigningTeam(null);
    setCurrentGame(null);
    // Re-queue all players to start a new "season"
    const allPlayerIds = Array.from(players.keys());
    setGameQueue(shuffleArray(allPlayerIds));
    setTeamQueue([]);
  }, [champion, players]);


  const startNextGame = useCallback(() => {
    if (currentGame || champion) return;

    // --- Doubles/Team Logic ---
    if (settings.playersPerTeam > 1) {
      // For WINNERS_STAY, the reigning team plays the next team from the team queue.
      if (settings.shuffleStrategy === ShuffleStrategy.WINNERS_STAY && reigningTeam) {
        if (teamQueue.length >= 1) {
          const challengers = teamQueue[0];
          setCurrentGame({ teamA: reigningTeam.team, teamB: challengers });
          setTeamQueue(prev => prev.slice(1));
          return;
        }
        // No challenger team available in the queue, wait for user to generate more.
        return; 
      }
      
      // For PER_GAME, or the first game of a WINNERS_STAY session, we need two teams from the queue.
      if (teamQueue.length >= 2) {
        setCurrentGame({ teamA: teamQueue[0], teamB: teamQueue[1] });
        setTeamQueue(prev => prev.slice(2));
        setReigningTeam(null); // Ensure reigning team is cleared for PER_GAME or first game.
        return;
      }
    }
    
    // --- Singles Logic ---
    if (settings.playersPerTeam === 1) {
        let playersForNextGame: Player[] = [];
        
        if (settings.shuffleStrategy === ShuffleStrategy.WINNERS_STAY && reigningTeam) {
            playersForNextGame.push(...reigningTeam.team);
        }

        const playersForNextGameIds = new Set(playersForNextGame.map(p => p.id));
        const availableQueue = gameQueue.filter(id => !playersForNextGameIds.has(id));
       
        if ((playersForNextGame.length + availableQueue.length) < 2) {
            setCurrentGame(null);
            return;
        }

        const priorityPlayers = availableQueue.filter(id => (playerStats.get(id)?.winStreak ?? 0) >= settings.winStreakThreshold);
        const nonPriorityPlayers = availableQueue.filter(id => !priorityPlayers.includes(id));
        
        const playerPoolIds = [...shuffleArray(priorityPlayers), ...shuffleArray(nonPriorityPlayers)];
        
        const needed = 2 - playersForNextGame.length;
        if(playerPoolIds.length < needed) {
            setCurrentGame(null);
            return;
        }

        const challengerIds = playerPoolIds.slice(0, needed);
        const challengers = challengerIds.map(id => players.get(id)!);
        
        const playersInMatch = [...playersForNextGame, ...challengers];
        
        setGameQueue(prev => prev.filter(id => !challengerIds.includes(id)));
        
        setCurrentGame({
            teamA: [playersInMatch[0]],
            teamB: [playersInMatch[1]]
        });
    }

  }, [currentGame, players, playerStats, settings, gameQueue, teamQueue, reigningTeam, champion]);

  const addPlayer = useCallback((name: string) => {
    clearChampionshipState(true);
    if (!name.trim()) return;
    const newId = new Date().getTime().toString() + Math.random();
    const newPlayer: Player = { id: newId, name: name.trim() };
    
    setPlayers(prev => new Map(prev).set(newId, newPlayer));
    setPlayerStats(prev => new Map(prev).set(newId, { wins: 0, losses: 0, winStreak: 0, championOfSession: false }));
    setGameQueue(prev => [...prev, newId]);
  }, [clearChampionshipState]);

  useEffect(() => {
    if (!currentGame) {
      startNextGame();
    }
  }, [gameQueue, teamQueue, currentGame, startNextGame]);
  
  const generateTeams = useCallback(() => {
    if (settings.playersPerTeam <= 1 || gameQueue.length < settings.playersPerTeam) return;

    const priorityPlayers = gameQueue.filter(id => (playerStats.get(id)?.winStreak ?? 0) >= settings.winStreakThreshold);
    const nonPriorityPlayers = gameQueue.filter(id => !priorityPlayers.includes(id));

    const playersToTeamUp = [...shuffleArray(priorityPlayers), ...shuffleArray(nonPriorityPlayers)];
    const newTeams: Player[][] = [];
    let unassignedPlayers: string[] = [];

    for (let i = 0; i < playersToTeamUp.length; i += settings.playersPerTeam) {
        const chunk = playersToTeamUp.slice(i, i + settings.playersPerTeam);
        if (chunk.length === settings.playersPerTeam) {
            newTeams.push(chunk.map(id => players.get(id)!));
        } else {
            unassignedPlayers.push(...chunk);
        }
    }
    
    setTeamQueue(prev => [...prev, ...newTeams]);
    setGameQueue(unassignedPlayers);

  }, [gameQueue, players, playerStats, settings.playersPerTeam, settings.winStreakThreshold]);

  const declareWinner = useCallback((winningTeam: 'teamA' | 'teamB') => {
    if (!currentGame) return;

    const winners = winningTeam === 'teamA' ? currentGame.teamA : currentGame.teamB;
    const losers = winningTeam === 'teamA' ? currentGame.teamB : currentGame.teamA;

    if (settings.shuffleStrategy === ShuffleStrategy.WINNERS_STAY) {
        const winnerIds = new Set(winners.map(p => p.id));
        
        const wereWinnersReigning = reigningTeam && reigningTeam.team.every(p => winnerIds.has(p.id));
        const defeatedOpponentsSoFar = wereWinnersReigning ? new Set(reigningTeam!.defeatedOpponents) : new Set<string>();
        losers.forEach(p => defeatedOpponentsSoFar.add(p.id));

        const allPlayerIds = Array.from(players.keys());
        const potentialOpponentIds = allPlayerIds.filter(id => !winnerIds.has(id));
        const hasDefeatedAll = potentialOpponentIds.length > 0 && potentialOpponentIds.every(id => defeatedOpponentsSoFar.has(id));

        const newStats = new Map(playerStats);
        winners.forEach(p => {
            const current = newStats.get(p.id)!;
            newStats.set(p.id, { ...current, wins: current.wins + 1, winStreak: current.winStreak + 1, championOfSession: hasDefeatedAll || current.championOfSession });
        });
        losers.forEach(p => {
            const current = newStats.get(p.id)!;
            newStats.set(p.id, { ...current, losses: current.losses + 1, winStreak: 0 });
        });
        setPlayerStats(newStats);
        setCurrentGame(null);
        setGameQueue(prev => [...prev, ...losers.map(p => p.id)]);

        if (hasDefeatedAll) {
            setChampion(winners);
            setReigningTeam(null); // Reign is over, they are champions.
        } else {
            setReigningTeam({ team: winners, defeatedOpponents: defeatedOpponentsSoFar });
        }

    } else { // PER_GAME strategy
        const newStats = new Map(playerStats);
        winners.forEach(p => {
            const current = newStats.get(p.id)!;
            newStats.set(p.id, { ...current, wins: current.wins + 1, winStreak: current.winStreak + 1 });
        });
        losers.forEach(p => {
            const current = newStats.get(p.id)!;
            newStats.set(p.id, { ...current, losses: current.losses + 1, winStreak: 0 });
        });
        setPlayerStats(newStats);
        setCurrentGame(null);
        const allPlayersFromGame = [...winners.map(p => p.id), ...losers.map(p => p.id)];
        setGameQueue(prev => [...prev, ...allPlayersFromGame]);
        setReigningTeam(null);
    }
  }, [currentGame, playerStats, settings, players, reigningTeam]);

  const removePlayer = useCallback((id: string) => {
    clearChampionshipState(true);
    setPlayers(prev => { const newMap = new Map(prev); newMap.delete(id); return newMap; });
    setPlayerStats(prev => { const newMap = new Map(prev); newMap.delete(id); return newMap; });
    setGameQueue(prev => prev.filter(pId => pId !== id));
    setTeamQueue(prev => {
        const newTeamQueue: Player[][] = [];
        let playersToRequeue: string[] = [];
        prev.forEach(team => {
            if (team.some(p => p.id === id)) {
                playersToRequeue.push(...team.filter(p => p.id !== id).map(p => p.id));
            } else {
                newTeamQueue.push(team);
            }
        });
        setGameQueue(gq => [...gq, ...playersToRequeue]);
        return newTeamQueue;
    });

    if (currentGame && (currentGame.teamA.some(p => p.id === id) || currentGame.teamB.some(p => p.id === id))) {
      const remainingPlayers = [...currentGame.teamA, ...currentGame.teamB].filter(p => p.id !== id).map(p => p.id);
      setGameQueue(gq => [...gq, ...remainingPlayers]);
      setCurrentGame(null);
    }
  }, [currentGame, clearChampionshipState]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
      const isSwitchingMode = (newSettings.playersPerTeam && newSettings.playersPerTeam !== settings.playersPerTeam) || 
                              (newSettings.shuffleStrategy && newSettings.shuffleStrategy !== settings.shuffleStrategy);
      
      setSettings(prev => ({...prev, ...newSettings}));
      
      if(isSwitchingMode) {
        clearChampionshipState(false);
        const allPlayerIds = Array.from(players.keys());
        setGameQueue(allPlayerIds);
        setTeamQueue([]);
        setCurrentGame(null);
      }
  }, [settings, players, clearChampionshipState]);

  const resetApp = useCallback(() => {
    setPlayers(new Map());
    setPlayerStats(new Map());
    setGameQueue([]);
    setTeamQueue([]);
    setCurrentGame(null);
    clearChampionshipState(false);
  }, [clearChampionshipState]);
  
  return {
    players,
    playerStats,
    gameQueue,
    teamQueue,
    currentGame,
    settings,
    reigningTeam,
    champion,
    actions: {
        addPlayer,
        removePlayer,
        declareWinner,
        updateSettings,
        generateTeams,
        startGame: startNextGame,
        resetApp,
        endChampionshipAndContinue,
    }
  };
};
