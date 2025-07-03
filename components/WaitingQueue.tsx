
import React from 'react';
import { Player, PlayerStats, Settings, ReigningTeam } from '../types';
import { CrownIcon } from './icons/CrownIcon';

interface WaitingQueueProps {
  playerIds: string[];
  teamQueue: Player[][];
  playersMap: Map<string, Player>;
  statsMap: Map<string, PlayerStats>;
  reigningTeam: ReigningTeam | null;
  settings: Settings;
}

interface SinglesQueueProps {
    playerIds: string[];
    playersMap: Map<string, Player>;
    statsMap: Map<string, PlayerStats>;
    settings: Settings;
}

const SinglesQueue: React.FC<SinglesQueueProps> = ({ playerIds, playersMap, statsMap, settings }) => (
    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {playerIds.length > 0 ? (
          playerIds.map((id, index) => {
            const player = playersMap.get(id);
            const stats = statsMap.get(id);
            if (!player) return null;
            const isPriority = (stats?.winStreak ?? 0) >= settings.winStreakThreshold;
            return (
              <div key={id} className={`flex items-center justify-between p-2 rounded-md ${isPriority ? 'bg-amber-500/10 border-l-4 border-amber-400' : 'bg-slate-700/50'}`}>
                <div>
                  <span className="font-bold text-slate-300 mr-3">#{index + 1}</span>
                  <span className="font-medium">{player.name}</span>
                </div>
                { (stats?.winStreak ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold" title={`Winning Streak: ${stats?.winStreak}`}>
                    <CrownIcon className="w-4 h-4" />
                    <span>{stats?.winStreak}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-slate-400 text-center py-4">The queue is empty.</p>
        )}
      </div>
);

const TeamQueue: React.FC<{teamQueue: Player[][]}> = ({ teamQueue }) => (
    <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
        {teamQueue.length > 0 ? (
            teamQueue.map((team, index) => (
                <div key={index} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-cyan-300 mb-2">Team #{index + 1}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {team.map(player => <span key={player.id} className="font-medium text-slate-300">{player.name}</span>)}
                    </div>
                </div>
            ))
        ) : (
             <p className="text-slate-400 text-center py-4">No teams in the queue.</p>
        )}
    </div>
);


const WaitingQueue: React.FC<WaitingQueueProps> = ({ playerIds, teamQueue, playersMap, statsMap, reigningTeam, settings }) => {
  const isDoublesMode = settings.playersPerTeam > 1;
  const queueCount = isDoublesMode ? teamQueue.length : playerIds.length;

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">{isDoublesMode ? 'Team Queue' : 'Waiting Queue'} ({queueCount})</h2>
      
      {reigningTeam && reigningTeam.team.length > 0 && (
          <div className="mb-4">
              <h3 className="text-sm font-semibold uppercase text-emerald-400 tracking-wider mb-2">Reigning Team</h3>
              <div className="space-y-2">
                  {reigningTeam.team.map(player => {
                      if (!player) return null;
                      return (
                          <div key={player.id} className="flex items-center justify-between bg-emerald-500/10 p-2 rounded-md border-l-4 border-emerald-400">
                              <span className="font-bold text-emerald-300">{player.name}</span>
                              <CrownIcon className="text-emerald-400"/>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}
      
      <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-2">{isDoublesMode ? 'Next Teams' : 'Next Players'}</h3>
      {isDoublesMode ? (
          <TeamQueue teamQueue={teamQueue} />
      ) : (
          <SinglesQueue playerIds={playerIds} playersMap={playersMap} statsMap={statsMap} settings={settings} />
      )}
    </div>
  );
};

export default WaitingQueue;
