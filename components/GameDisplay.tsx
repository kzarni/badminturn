
import React from 'react';
import { Game, Player, Settings } from '../types';
import { CrownIcon } from './icons/CrownIcon';

interface GameDisplayProps {
  game: Game | null;
  onDeclareWinner: (winningTeam: 'teamA' | 'teamB') => void;
  onStartGame: () => void;
  playerCount: number;
  settings: Settings;
}

const TeamDisplay: React.FC<{ team: Player[] | undefined, title: string }> = ({ team, title }) => (
    <div className="flex-1 bg-slate-700/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[150px]">
        <h3 className="text-lg font-bold text-cyan-400 mb-3">{title}</h3>
        {team && team.length > 0 ? (
            <div className="space-y-2 text-center">
                {team.map(player => (
                    <p key={player.id} className="text-xl font-semibold text-slate-100">{player.name}</p>
                ))}
            </div>
        ) : (
             <p className="text-slate-400">--</p>
        )}
    </div>
);


const GameDisplay: React.FC<GameDisplayProps> = ({ game, onDeclareWinner, onStartGame, playerCount, settings }) => {
  const playersNeeded = settings.playersPerTeam * 2;
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Current Game</h2>
      
      {game ? (
        <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
                <TeamDisplay team={game.teamA} title="Team A" />
                <span className="text-4xl font-black text-slate-500">VS</span>
                <TeamDisplay team={game.teamB} title="Team B" />
            </div>

            <div className="flex justify-around items-center pt-4">
                <button onClick={() => onDeclareWinner('teamA')} className="w-2/5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg">
                  <CrownIcon /> Team A Wins
                </button>
                <button onClick={() => onDeclareWinner('teamB')} className="w-2/5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg">
                   <CrownIcon /> Team B Wins
                </button>
            </div>
        </div>
      ) : (
        <div className="text-center py-10 flex flex-col items-center justify-center min-h-[250px]">
            <p className="text-slate-400 text-xl mb-4">
              {playerCount < playersNeeded ? `Waiting for at least ${playersNeeded - playerCount} more player(s)...` : "No game in progress."}
            </p>
            {playerCount >= playersNeeded && (
                <button 
                  onClick={onStartGame} 
                  className="bg-emerald-500 text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-emerald-400 transition-colors shadow-emerald-500/20 shadow-md">
                    Start First Game
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default GameDisplay;
