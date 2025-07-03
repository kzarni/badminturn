
import React from 'react';
import { Settings, ShuffleStrategy } from '../types';
import { RestartIcon } from './icons/RestartIcon';

interface SettingsPanelProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onResetApp: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, onResetApp }) => {
  const handleStreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onUpdateSettings({ winStreakThreshold: value });
    }
  };
  
  const handleStrategyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ shuffleStrategy: e.target.value as ShuffleStrategy });
  };

  const handlePlayersPerTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onUpdateSettings({ playersPerTeam: value });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restart everything? All players and stats will be lost.')) {
      onResetApp();
    }
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-300 mb-4">Game Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game Format */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Game Format
          </label>
          <p className="text-xs text-slate-500 mb-2">Players per team.</p>
          <div className="space-y-2">
            <RadioOption
              id="singles"
              name="playersPerTeam"
              value="1"
              checked={settings.playersPerTeam === 1}
              onChange={handlePlayersPerTeamChange}
              label="Singles"
              description="1 vs 1"
            />
            <RadioOption
              id="doubles"
              name="playersPerTeam"
              value="2"
              checked={settings.playersPerTeam === 2}
              onChange={handlePlayersPerTeamChange}
              label="Doubles"
              description="2 vs 2"
            />
          </div>
        </div>
        
        {/* Win Streak Threshold */}
        <div>
          <label htmlFor="winStreak" className="block text-sm font-medium text-slate-400 mb-1">
            Winning Streak Priority
          </label>
          <p className="text-xs text-slate-500 mb-2">Players with this many consecutive wins get priority in the queue.</p>
          <input
            id="winStreak"
            type="number"
            min="1"
            value={settings.winStreakThreshold}
            onChange={handleStreakChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
          />
        </div>

        {/* Shuffle Strategy */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Team Shuffling
          </label>
           <p className="text-xs text-slate-500 mb-2">How are teams handled after a game?</p>
          <div className="space-y-2">
            <RadioOption
              id="per_game"
              name="shuffleStrategy"
              value={ShuffleStrategy.PER_GAME}
              checked={settings.shuffleStrategy === ShuffleStrategy.PER_GAME}
              onChange={handleStrategyChange}
              label="Shuffle All Players"
              description="All players return to the queue."
            />
            <RadioOption
              id="winners_stay"
              name="shuffleStrategy"
              value={ShuffleStrategy.WINNERS_STAY}
              checked={settings.shuffleStrategy === ShuffleStrategy.WINNERS_STAY}
              onChange={handleStrategyChange}
              label="Winners Stay On"
              description="The winning team stays on court for the next game."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-600 my-6"></div>

      <div>
        <h3 className="text-lg font-semibold text-rose-400 mb-2">Danger Zone</h3>
        <p className="text-xs text-slate-500 mb-3">This action will delete all players and reset all game progress.</p>
        <button 
            onClick={handleReset}
            className="w-full sm:w-auto bg-rose-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
        >
            <RestartIcon />
            Restart Everything
        </button>
      </div>
    </div>
  );
};

interface RadioOptionProps {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    description: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({ id, name, value, checked, onChange, label, description }) => (
    <label htmlFor={id} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${checked ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}>
        <input
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-emerald-600 bg-slate-600 border-slate-500 focus:ring-emerald-500"
        />
        <div className="ml-3 text-sm">
            <p className={`font-medium ${checked ? 'text-emerald-300' : 'text-slate-300'}`}>{label}</p>
            <p className={`text-xs ${checked ? 'text-emerald-400/80' : 'text-slate-400'}`}>{description}</p>
        </div>
    </label>
)

export default SettingsPanel;