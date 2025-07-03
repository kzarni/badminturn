import React from 'react';
import { Player } from '../types';

interface TeamManagerProps {
  onGenerateTeams: () => void;
  gameQueue: string[];
  playersMap: Map<string, Player>;
  playersPerTeam: number;
}

const TeamManager: React.FC<TeamManagerProps> = ({ onGenerateTeams, gameQueue, playersMap, playersPerTeam }) => {
  const canGenerateTeams = gameQueue.length >= playersPerTeam;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">Team Manager</h2>
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-2">
          Players Waiting For Team ({gameQueue.length})
        </h3>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 bg-slate-900/50 p-3 rounded-md">
            {gameQueue.length > 0 ? (
                gameQueue.map(id => {
                    const player = playersMap.get(id);
                    return <p key={id} className="text-slate-300">{player?.name || 'Unknown Player'}</p>
                })
            ) : (
                <p className="text-slate-500 text-center py-2">No players are waiting.</p>
            )}
        </div>
      </div>
      <button 
        onClick={onGenerateTeams}
        disabled={!canGenerateTeams}
        className="w-full bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400"
        title={!canGenerateTeams ? `Need at least ${playersPerTeam} players to generate a team.` : 'Shuffle waiting players into new teams'}
      >
        Shuffle &amp; Generate Teams
      </button>
    </div>
  );
};

export default TeamManager;
