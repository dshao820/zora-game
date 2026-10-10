import { AnimalCharacter } from '../components/AnimalCharacter';
import { Balloon } from '../components/Balloon';
import { HabitatArt } from '../components/HabitatArt';
import { EarIcon, NumberBlocksIcon, PaletteIcon, QuestionIcon, ShirtIcon, TrophyIcon } from '../components/icons';
import { NumberTile } from '../components/NumberTile';
import AnimalHome, { MODE_ID as ANIMALS_HOME } from './Animals/AnimalHome';
import LearnAnimals, { MODE_ID as ANIMALS_LEARN } from './Animals/LearnAnimals';
import SoundQuiz, { MODE_ID as ANIMALS_SOUND } from './Animals/SoundQuiz';
import Challenges, { MODE_ID as CHALLENGES } from './Challenges/Challenges';
import DressUp, { MODE_ID as COLORS_DRESS } from './Colors/DressUp';
import FindColor, { MODE_ID as COLORS_FIND } from './Colors/FindColor';
import LearnColors, { MODE_ID as COLORS_LEARN } from './Colors/LearnColors';
import CountQuiz, { MODE_ID as NUMBERS_COUNT } from './Numbers/CountQuiz';
import LearnNumbers, { MODE_ID as NUMBERS_LEARN } from './Numbers/LearnNumbers';
import NumberMatch, { MODE_ID as NUMBERS_MATCH } from './Numbers/NumberMatch';
import type { GameDef, GameId } from './types';

const ICON = '72%';

/** 遊戲註冊表：新增模式只要在這裡加一筆 */
export const GAMES: Record<GameId, GameDef> = {
  numbers: {
    id: 'numbers',
    title: '數字樂園',
    color: '#ffe0b2',
    icon: <NumberBlocksIcon size={ICON} />,
    modes: [
      {
        id: NUMBERS_LEARN,
        label: '認識數字',
        color: '#ffe0b2',
        icon: <NumberTile n={3} size="clamp(105px, 16.5vmin, 195px)" />,
        Component: LearnNumbers,
      },
      {
        id: NUMBERS_COUNT,
        label: '數數看',
        color: '#fff3c4',
        icon: (
          <div className="flex items-center">
            <AnimalCharacter species="duck" size="clamp(90px, 13.5vmin, 165px)" anim="none" />
            <QuestionIcon size="clamp(60px, 9vmin, 105px)" />
          </div>
        ),
        Component: CountQuiz,
      },
      {
        id: NUMBERS_MATCH,
        label: '數字配對',
        color: '#d9f99d',
        icon: (
          <div className="flex items-center gap-1">
            <NumberTile n={2} size="clamp(75px, 12vmin, 135px)" dots={false} />
            <AnimalCharacter species="rabbit" size="clamp(67.5px, 10.5vmin, 120px)" anim="none" />
            <AnimalCharacter species="rabbit" size="clamp(67.5px, 10.5vmin, 120px)" anim="none" />
          </div>
        ),
        Component: NumberMatch,
      },
    ],
  },
  colors: {
    id: 'colors',
    title: '顏色樂園',
    color: '#fbcfe8',
    icon: <PaletteIcon size={ICON} />,
    modes: [
      {
        id: COLORS_LEARN,
        label: '認識顏色',
        color: '#fecaca',
        icon: <Balloon color="#ef5350" size="clamp(82.5px, 12vmin, 142.5px)" />,
        Component: LearnColors,
      },
      {
        id: COLORS_FIND,
        label: '找顏色',
        color: '#bfdbfe',
        icon: (
          <div className="flex items-end">
            <Balloon color="#ffd93d" size="clamp(57px, 8.2vmin, 99px)" face={false} />
            <Balloon color="#4d96ff" size="clamp(72px, 10.5vmin, 123px)" />
            <Balloon color="#5cc46b" size="clamp(57px, 8.2vmin, 99px)" face={false} />
          </div>
        ),
        Component: FindColor,
      },
      {
        id: COLORS_DRESS,
        label: '穿衣服',
        color: '#e9d5ff',
        icon: (
          <div className="flex items-center">
            <AnimalCharacter species="rabbit" size="clamp(105px, 15vmin, 180px)" anim="none" shirt="#ef5350" />
            <ShirtIcon size="clamp(54px, 7.5vmin, 90px)" color="#4d96ff" />
          </div>
        ),
        Component: DressUp,
      },
    ],
  },
  animals: {
    id: 'animals',
    title: '動物樂園',
    color: '#bbf7d0',
    icon: <AnimalCharacter species="panda" size={ICON} anim="none" />,
    modes: [
      {
        id: ANIMALS_LEARN,
        label: '認識動物',
        color: '#bbf7d0',
        icon: <AnimalCharacter species="dog" size="clamp(120px, 18vmin, 210px)" anim="none" />,
        Component: LearnAnimals,
      },
      {
        id: ANIMALS_SOUND,
        label: '聽聲音',
        color: '#fef08a',
        icon: (
          <div className="flex items-center">
            <EarIcon size="clamp(69px, 10.5vmin, 120px)" />
            <AnimalCharacter species="cat" size="clamp(96px, 13.5vmin, 165px)" anim="none" />
          </div>
        ),
        Component: SoundQuiz,
      },
      {
        id: ANIMALS_HOME,
        label: '動物找家',
        color: '#bae6fd',
        icon: (
          <div className="relative flex w-[clamp(165px,24vmin,270px)] items-end justify-center">
            <HabitatArt id="pond" />
            <div className="absolute bottom-[18%]">
              <AnimalCharacter species="duck" size="clamp(75px, 10.5vmin, 126px)" anim="none" />
            </div>
          </div>
        ),
        Component: AnimalHome,
      },
    ],
  },
  challenges: {
    id: 'challenges',
    title: '小小挑戰',
    color: '#fde68a',
    icon: <TrophyIcon size={ICON} />,
    modes: [{ id: CHALLENGES, label: '小小挑戰', color: '#fde68a', icon: <TrophyIcon size={ICON} />, Component: Challenges }],
  },
};

export const GAME_ORDER: GameId[] = ['numbers', 'colors', 'animals', 'challenges'];
