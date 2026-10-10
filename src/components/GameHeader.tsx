import { ReplayButton, SoundToggle } from './AudioButton';
import { GameButton, ROUND_BTN } from './GameButton';
import { BackIcon, HomeIcon } from './icons';
import { StarBar } from './StarBar';

export const HEADER_HEIGHT = 'calc(80px + 28px + env(safe-area-inset-top))';

interface Props {
  onHome?: () => void;
  onBack?: () => void;
}

/** 畫面上方固定列：返回首頁、返回、星星、重播語音、音效開關 */
export function GameHeader({ onHome, onBack }: Props) {
  return (
    <header
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-3 sm:px-5"
      style={{ height: HEADER_HEIGHT, paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex gap-2 sm:gap-3">
        {onHome && (
          <GameButton className={ROUND_BTN} onClick={onHome} aria-label="回首頁">
            <HomeIcon size={46} />
          </GameButton>
        )}
        {onBack && (
          <GameButton className={ROUND_BTN} onClick={onBack} aria-label="回上一頁">
            <BackIcon size={42} />
          </GameButton>
        )}
      </div>
      <div className="max-sm:absolute max-sm:left-1/2 max-sm:top-[calc(100%-4px)] max-sm:-translate-x-1/2 max-sm:scale-90">
        <StarBar />
      </div>
      <div className="flex gap-2 sm:gap-3">
        <ReplayButton />
        <SoundToggle />
      </div>
    </header>
  );
}
