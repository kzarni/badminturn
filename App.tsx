import React from 'react';
import { useBadmintonScheduler } from './hooks/useBadmintonScheduler';
import PlayerManager from './components/PlayerManager';
import GameDisplay from './components/GameDisplay';
import WaitingQueue from './components/WaitingQueue';
import SettingsPanel from './components/SettingsPanel';
import PlayerStats from './components/PlayerStats';
import TeamManager from './components/TeamManager';
import ChampionPopup from './components/ChampionPopup';

const App: React.FC = () => {
    const {
        players,
        playerStats,
        gameQueue,
        teamQueue,
        currentGame,
        settings,
        reigningTeam,
        champion,
        actions,
    } = useBadmintonScheduler();

    const isDoublesMode = settings.playersPerTeam > 1;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
            <ChampionPopup champion={champion} onClose={actions.endChampionshipAndContinue} />
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pb-2">
                        Badminturn
                    </h1>
                    <p className="text-slate-400 text-lg">Manage your court rotations like a pro.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Game and Controls */}
                    <div className="lg:col-span-2 space-y-8">
                        <GameDisplay 
                            game={currentGame} 
                            onDeclareWinner={actions.declareWinner} 
                            onStartGame={actions.startGame} 
                            playerCount={players.size}
                            settings={settings}
                        />
                        <SettingsPanel 
                            settings={settings} 
                            onUpdateSettings={actions.updateSettings}
                            onResetApp={actions.resetApp} 
                        />
                    </div>

                    {/* Right Column: Players and Queue */}
                    <div className="space-y-8">
                        <PlayerManager 
                            onAddPlayer={actions.addPlayer}
                            players={Array.from(players.values())}
                            onRemovePlayer={actions.removePlayer}
                        />
                        {isDoublesMode && (
                            <TeamManager 
                                onGenerateTeams={actions.generateTeams}
                                gameQueue={gameQueue}
                                playersMap={players}
                                playersPerTeam={settings.playersPerTeam}
                            />
                        )}
                        <WaitingQueue 
                            playerIds={gameQueue}
                            teamQueue={teamQueue}
                            playersMap={players}
                            statsMap={playerStats}
                            reigningTeam={reigningTeam}
                            settings={settings}
                        />
                    </div>
                </main>

                <footer className="mt-12">
                     <PlayerStats playersMap={players} statsMap={playerStats} />
                </footer>
            </div>
        </div>
    );
};

export default App;