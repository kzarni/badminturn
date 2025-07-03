import React from 'react';
import { Player } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

interface ChampionPopupProps {
  champion: Player[] | null;
  onClose: () => void;
}

const ChampionPopup: React.FC<ChampionPopupProps> = ({ champion, onClose }) => {
  if (!champion) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity animate-fade-in">
      <div className="bg-slate-800 border-2 border-amber-400 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-md w-full p-8 text-center transform transition-all animate-scale-in">
        <div className="flex justify-center text-amber-400 mb-4">
          <TrophyIcon className="h-20 w-20" />
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
          CHAMPIONS!
        </h2>
        <p className="text-slate-400 mt-2 mb-6">Congratulations to the winning team!</p>
        
        <div className="space-y-3 mb-8">
            {champion.map(player => (
                <p key={player.id} className="text-2xl font-bold text-slate-100 bg-slate-700/50 rounded-lg py-3">
                    {player.name}
                </p>
            ))}
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-emerald-500 text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-emerald-400 transition-colors shadow-emerald-500/20 shadow-md">
            Continue Session
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scale-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChampionPopup;
