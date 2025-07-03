import React from 'react';
import { Player, PlayerStats as PlayerStatsType } from '../types';
import { CrownIcon } from './icons/CrownIcon';
import { TrophyIcon } from './icons/TrophyIcon';

interface PlayerStatsProps {
  playersMap: Map<string, Player>;
  statsMap: Map<string, PlayerStatsType>;
}

const ChampionBadge: React.FC = () => (
    <div 
      className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 font-semibold px-2.5 py-1 rounded-full text-xs border border-amber-400/20"
      title="Champion of the Session"
    >
      <TrophyIcon className="w-4 h-4" />
      <span>Champion</span>
    </div>
);

const PlayerStats: React.FC<PlayerStatsProps> = ({ playersMap, statsMap }) => {
  const players = Array.from(playersMap.values());

  if (players.length === 0) {
    return null;
  }
  
  // Sort players by champion status, then wins, then win streak
  const sortedPlayers = players.sort((a, b) => {
    const statsA = statsMap.get(a.id) || { wins: 0, winStreak: 0, losses: 0, championOfSession: false };
    const statsB = statsMap.get(b.id) || { wins: 0, winStreak: 0, losses: 0, championOfSession: false };
    
    // Champions should always be at the top
    if (statsA.championOfSession !== statsB.championOfSession) {
      return Number(statsB.championOfSession) - Number(statsA.championOfSession);
    }
    // Then sort by wins
    if (statsB.wins !== statsA.wins) {
        return statsB.wins - statsA.wins;
    }
    // Then by win streak
    return statsB.winStreak - statsA.winStreak;
  });

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-300 mb-4">Player Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-600">
            <tr className="text-sm uppercase text-slate-400">
              <th className="p-3">Rank</th>
              <th className="p-3">Player</th>
              <th className="p-3 text-center">Wins</th>
              <th className="p-3 text-center">Losses</th>
              <th className="p-3 text-center">W/L Ratio</th>
              <th className="p-3 text-center">Win Streak</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const stats = statsMap.get(player.id) || { wins: 0, losses: 0, winStreak: 0, championOfSession: false };
              const ratio = stats.losses > 0 ? (stats.wins / stats.losses).toFixed(2) : '∞';
              
              return (
                <tr key={player.id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors">
                  <td className="p-3 font-bold text-lg text-slate-400">#{index + 1}</td>
                  <td className="p-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        {stats.championOfSession && (
                            <ChampionBadge />
                        )}
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-emerald-400">{stats.wins}</td>
                  <td className="p-3 text-center font-bold text-rose-400">{stats.losses}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{ratio}</td>
                  <td className="p-3 text-center font-bold text-amber-400">
                    <div className="flex items-center justify-center gap-2">
                      {stats.winStreak > 0 ? <CrownIcon className="w-5 h-5"/> : ''}
                      <span>{stats.winStreak}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStats;