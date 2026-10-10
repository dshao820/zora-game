import { preloadAnimalSounds } from './hooks/useAudio';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useState } from 'react';
import { Caption } from './components/Caption';
import { GameHeader, HEADER_HEIGHT } from './components/GameHeader';
import { Home } from './components/Home';
import { LoadingScreen } from './components/LoadingScreen';
import { ModePicker } from './components/ModePicker';
import { ParentGate } from './components/ParentGate';
import { ParentSettings } from './components/ParentSettings';
import { RewardAnimation } from './components/RewardAnimation';
import { SceneBackground } from './components/SceneBackground';
import { HOME_PROMPT, WELCOME } from './data/phrases';
import { GAMES } from './games/registry';
import type { GameId } from './games/types';
import { audio } from './lib/audio';
import { speech } from './lib/speech';

type Screen = 'loading' | 'home' | GameId;

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [mode, setMode] = useState<string | null>(null);
  const [parentOpen, setParentOpen] = useState(false);
  const [greeting, setGreeting] = useState(WELCOME);

  const start = () => {
    // 第一次使用者互動：解鎖音訊與語音
    audio.unlock();
    speech.unlock();
    preloadAnimalSounds();
    setScreen('home');
  };

  const goHome = () => {
    setGreeting(HOME_PROMPT);
    setMode(null);
    setScreen('home');
  };

  const openGame = (id: GameId) => {
    const g = GAMES[id];
    setMode(g.modes.length === 1 ? g.modes[0].id : null);
    setScreen(id);
  };

  const game = screen !== 'loading' && screen !== 'home' ? GAMES[screen] : null;
  const ModeComponent = game && mode ? game.modes.find((m) => m.id === mode)?.Component : null;
  const contentKey = `${screen}:${mode ?? ''}`;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-full w-full overflow-hidden">
        <SceneBackground rich={screen !== 'loading' && !game} />

        {screen === 'loading' ? (
          <LoadingScreen onStart={start} />
        ) : (
          <>
            <GameHeader
              onHome={game ? goHome : undefined}
              onBack={game && mode && game.modes.length > 1 ? () => setMode(null) : undefined}
            />
            <main className="absolute inset-x-0 bottom-0 z-10" style={{ top: HEADER_HEIGHT, paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={contentKey}
                  className="size-full"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                >
                  {screen === 'home' && <Home greeting={greeting} onOpen={openGame} />}
                  {game && !ModeComponent && <ModePicker game={game} onPick={setMode} />}
                  {ModeComponent && <ModeComponent />}
                </motion.div>
              </AnimatePresence>
            </main>
            {screen === 'home' && <ParentGate onOpen={() => setParentOpen(true)} />}
          </>
        )}

        <AnimatePresence>{parentOpen && <ParentSettings onClose={() => setParentOpen(false)} />}</AnimatePresence>
        <RewardAnimation />
        <Caption />
      </div>
    </MotionConfig>
  );
}
