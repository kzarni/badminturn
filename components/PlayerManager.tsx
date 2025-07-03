
import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PlayerManagerProps {
  onAddPlayer: (name: string) => void;
  players: Player[];
  onRemovePlayer: (id: string) => void;
}

const PlayerManager: React.FC<PlayerManagerProps> = ({ onAddPlayer, players, onRemovePlayer }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName);
      setNewPlayerName('');
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4">Players ({players.length})</h2>
      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter new player name"
          className="flex-grow bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
        />
        <button type="submit" className="bg-emerald-500 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-emerald-400 transition-colors flex items-center gap-2">
          <UserPlusIcon />
          Add
        </button>
      </form>
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {players.length > 0 ? (
          players.map(player => (
            <div key={player.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
              <span className="font-medium text-slate-300">{player.name}</span>
              <button onClick={() => onRemovePlayer(player.id)} className="text-rose-500 hover:text-rose-400 transition-colors p-1 rounded-full hover:bg-rose-500/10">
                <TrashIcon />
              </button>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-4">No players added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerManager;
