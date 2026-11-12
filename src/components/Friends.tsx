import { useEffect, useRef, useState } from 'react';
import type { AnimalInfo } from '../data/animals';
import { friendCount, FRIENDS } from '../data/friends';
import { playAnimalSound } from '../hooks/useAudio';
import { useShake } from '../hooks/useFeedback';
import { useGameProgress } from '../hooks/useGameProgress';
import { useReplay } from '../hooks/useReplay';
import { useSpeech } from '../hooks/useSpeech';
import { audio } from '../lib/audio';
import { u } from '../lib/ui';
import { AnimalCharacter } from './AnimalCharacter';
import { CARD_BTN, GameButton } from './GameButton';
import { QuestionIcon, StarIcon } from './icons';

const TOTAL = FRIENDS.length;

/**
 * 我的動物朋友：每得到一顆星星就多一位朋友。
 * 點朋友會打招呼、叫一聲；還沒來的朋友只看得到影子。
 */
export function Friends() {
  const { progress, markFriendsSeen } = useGameProgress();
  const say = useSpeech();
  const shaker = useShake();
  const count = friendCount(progress.stars);
  const [bumps, setBumps] = useState<Record<string, number>>({});
  /** 連續點不同動物時，只讓最後一次的叫聲播出來 */
  const turn = useRef(0);

  const intro =
    count >= TOTAL ? '所有的動物都是你的好朋友了！點點看，跟牠們打招呼！' : '這些是你的動物朋友！收集星星，就會有新朋友喔！';

  useEffect(() => {
    markFriendsSeen();
    void say(intro);
    return () => {
      turn.current += 1;
    };
  }, []);

  useReplay(() => void say(intro));

  const greet = async (a: AnimalInfo) => {
    const t = ++turn.current;
    audio.play('boing');
    setBumps((b) => ({ ...b, [a.id]: (b[a.id] ?? 0) + 1 }));
    await say(`${a.name}！`);
    if (turn.current === t) await playAnimalSound(a);
  };

  const knock = (a: AnimalInfo) => {
    turn.current += 1;
    shaker.shake(a.id);
    void say('再收集星星，就可以認識新朋友喔！');
  };

  return (
    <div className="flex size-full overflow-y-auto px-3 pb-4 max-sm:pt-16" style={{ touchAction: 'pan-y' }}>
      <div className="m-auto flex flex-col items-center" style={{ gap: u(1.5) }}>
        <h1
          className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-2 font-black text-[#4a3b3f] shadow"
          style={{ fontSize: `max(20px, ${u(2.6)})` }}
        >
          我的動物朋友
          <span className="flex items-center gap-1 tabular-nums">
            <StarIcon size="1.2em" />
            {count}/{TOTAL}
          </span>
        </h1>

        <div className="grid grid-cols-3 landscape:grid-cols-6" style={{ gap: u(1.5) }}>
          {FRIENDS.map((a, i) => {
            const here = i < count;
            const bump = bumps[a.id] ?? 0;
            return (
              <div key={a.id} ref={shaker.register(a.id)}>
                <GameButton
                  className={`${CARD_BTN} flex-col p-1 ${here ? '' : 'bg-white/50!'}`}
                  style={{ width: `max(92px, ${u(12.5)})` }}
                  onClick={() => (here ? void greet(a) : knock(a))}
                  aria-label={here ? a.name : '還沒認識的朋友'}
                  sound={here ? null : 'tap'}
                >
                  <div className="relative flex items-center justify-center">
                    <div style={here ? undefined : { filter: 'brightness(0)', opacity: 0.16 }}>
                      <AnimalCharacter
                        species={a.id}
                        size={`max(64px, ${u(8.5)})`}
                        anim={!here ? 'none' : bump === 0 ? 'idle' : bump % 3 === 0 ? 'spin' : 'happy'}
                        animKey={bump}
                        wag={bump > 0}
                        label={here ? undefined : '影子'}
                      />
                    </div>
                    {!here && <QuestionIcon size="42%" className="absolute" />}
                  </div>
                  <span className="font-black text-[#4a3b3f]" style={{ fontSize: `max(14px, ${u(1.7)})`, opacity: here ? 1 : 0 }}>
                    {a.name}
                  </span>
                </GameButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
