import { useGameProgress } from '../hooks/useGameProgress';
import { useReplayTrigger } from '../hooks/useReplay';
import { useSpeechState } from '../hooks/useSpeech';
import { GameButton, ROUND_BTN } from './GameButton';
import { MusicIcon, SpeakerIcon } from './icons';

/** 重播目前題目的語音 */
export function ReplayButton() {
  const replay = useReplayTrigger();
  const { speaking } = useSpeechState();
  return (
    <GameButton className={ROUND_BTN} onClick={replay} aria-label="再聽一次" sound={null}>
      <span className={speaking ? 'pulse-soft' : ''} style={{ display: 'flex' }}>
        <SpeakerIcon size={48} />
      </span>
    </GameButton>
  );
}

/** 總音效開關（音樂、音效、語音全部） */
export function SoundToggle() {
  const { settings, updateSettings } = useGameProgress();
  const off = settings.muted;
  return (
    <GameButton
      className={`${ROUND_BTN} ${off ? 'bg-slate-200!' : ''}`}
      onClick={() => updateSettings({ muted: !off })}
      aria-label={off ? '打開聲音' : '關掉聲音'}
      aria-pressed={!off}
    >
      <MusicIcon size={46} off={off} />
    </GameButton>
  );
}
