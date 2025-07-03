export interface Player {
  id: string;
  name: string;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  winStreak: number;
  championOfSession: boolean;
}

export enum ShuffleStrategy {
  PER_GAME = 'PER_GAME',
  WINNERS_STAY = 'WINNERS_STAY',
}

export interface Settings {
  winStreakThreshold: number;
  shuffleStrategy: ShuffleStrategy;
  playersPerTeam: number;
}

export interface Game {
  teamA: Player[];
  teamB: Player[];
}

export interface ReigningTeam {
    team: Player[];
    defeatedOpponents: Set<string>;
}

export interface BadmintonScheduler {
    players: Map<string, Player>;
    playerStats: Map<string, PlayerStats>;
    gameQueue: string[];
    teamQueue: Player[][];
    currentGame: Game | null;
    settings: Settings;
    reigningTeam: ReigningTeam | null;
    champion: Player[] | null;
    actions: {
        addPlayer: (name: string) => void;
        removePlayer: (id: string) => void;
        declareWinner: (winningTeam: 'teamA' | 'teamB') => void;
        updateSettings: (newSettings: Partial<Settings>) => void;
        startGame: () => void;
        generateTeams: () => void;
        resetApp: () => void;
        endChampionshipAndContinue: () => void;
    }
}