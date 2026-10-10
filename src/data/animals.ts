export type Species =
  | 'dog' | 'cat' | 'rabbit' | 'duck' | 'chick' | 'cow'
  | 'sheep' | 'pig' | 'elephant' | 'lion' | 'monkey' | 'panda'
  | 'frog' | 'horse' | 'squirrel' | 'giraffe' | 'penguin' | 'turtle' | 'bird';

export type AnimalId = Exclude<Species, 'bird'>;

export type HabitatId = 'pond' | 'tree' | 'doghouse' | 'barn' | 'savanna' | 'bamboo' | 'carrots' | 'bed' | 'ice';

export interface AnimalInfo {
  id: AnimalId;
  name: string;
  /** 叫聲（由語音念出） */
  sound: string;
  /** 是否有大家熟悉的叫聲，可用於「聽聲音找動物」 */
  hasCall: boolean;
  /** 真實錄音（public/sounds/，來源見 public/sounds/CREDITS.md）；沒有或播放失敗時改用語音念 sound */
  soundUrl?: string;
  habitat: HabitatId;
  habitatQuestion: string;
  habitatPraise: string;
  /** 換顏色後仍然好辨認，可用於「小小挑戰」的顏色題 */
  tintable: boolean;
}

/** 依難度解鎖的順序排列：前 6 隻 = 初級、前 12 隻 = 中級、全部 = 進階 */
export const ANIMALS: AnimalInfo[] = [
  { id: 'dog', name: '小狗', sound: '汪！汪！', hasCall: true, soundUrl: 'sounds/dog.mp3',
    habitat: 'doghouse',
    habitatQuestion: '小狗的家在哪裡呢？', habitatPraise: '對了！小狗住在狗屋裡！', tintable: true },
  { id: 'cat', name: '小貓', sound: '喵～喵～', hasCall: true, soundUrl: 'sounds/cat.mp3',
    habitat: 'bed',
    habitatQuestion: '小貓喜歡在哪裡睡覺呢？', habitatPraise: '對了！小貓在軟軟的小床睡覺！', tintable: true },
  { id: 'rabbit', name: '小兔子', sound: '蹦！蹦！蹦！', hasCall: false, habitat: 'carrots',
    habitatQuestion: '小兔子喜歡在哪裡吃紅蘿蔔呢？', habitatPraise: '對了！小兔子在紅蘿蔔田吃紅蘿蔔！', tintable: true },
  { id: 'duck', name: '小鴨', sound: '呱！呱！呱！', hasCall: true, soundUrl: 'sounds/duck.mp3',
    habitat: 'pond',
    habitatQuestion: '小鴨喜歡在哪裡游泳呢？', habitatPraise: '對了！小鴨在池塘裡游泳！', tintable: true },
  { id: 'chick', name: '小雞', sound: '啾！啾！啾！', hasCall: true, soundUrl: 'sounds/chick.mp3',
    habitat: 'barn',
    habitatQuestion: '小雞住在哪裡呢？', habitatPraise: '對了！小雞住在農場裡！', tintable: true },
  { id: 'pig', name: '小豬', sound: '齁！齁！齁！', hasCall: true, soundUrl: 'sounds/pig.mp3',
    habitat: 'barn',
    habitatQuestion: '小豬住在哪裡呢？', habitatPraise: '對了！小豬住在農場裡！', tintable: true },
  { id: 'cow', name: '小牛', sound: '哞～哞～', hasCall: true, soundUrl: 'sounds/cow.mp3',
    habitat: 'barn',
    habitatQuestion: '小牛住在哪裡呢？', habitatPraise: '對了！小牛住在農場裡！', tintable: false },
  { id: 'sheep', name: '小羊', sound: '咩～咩～', hasCall: true, soundUrl: 'sounds/sheep.mp3',
    habitat: 'barn',
    habitatQuestion: '小羊住在哪裡呢？', habitatPraise: '對了！小羊住在農場裡！', tintable: false },
  { id: 'monkey', name: '猴子', sound: '吱吱！吱吱！', hasCall: true, soundUrl: 'sounds/monkey.mp3',
    habitat: 'tree',
    habitatQuestion: '猴子喜歡在哪裡爬來爬去呢？', habitatPraise: '對了！猴子在樹上爬來爬去！', tintable: false },
  { id: 'frog', name: '青蛙', sound: '呱呱！呱呱！', hasCall: true, soundUrl: 'sounds/frog.mp3',
    habitat: 'pond',
    habitatQuestion: '青蛙喜歡在哪裡跳來跳去呢？', habitatPraise: '對了！青蛙在池塘的荷葉上跳來跳去！', tintable: false },
  { id: 'horse', name: '小馬', sound: '嘶～嘶～', hasCall: true, soundUrl: 'sounds/horse.mp3',
    habitat: 'barn',
    habitatQuestion: '小馬住在哪裡呢？', habitatPraise: '對了！小馬住在農場裡！', tintable: false },
  { id: 'squirrel', name: '松鼠', sound: '吱！吱！吱！', hasCall: false, habitat: 'tree',
    habitatQuestion: '松鼠喜歡在哪裡藏果子呢？', habitatPraise: '對了！松鼠把果子藏在樹上！', tintable: false },
  { id: 'elephant', name: '大象', sound: '叭噗～叭噗～', hasCall: true, soundUrl: 'sounds/elephant.mp3',
    habitat: 'savanna',
    habitatQuestion: '大象喜歡在哪裡散步呢？', habitatPraise: '對了！大象在大草原散步！', tintable: false },
  { id: 'lion', name: '獅子', sound: '吼～吼～', hasCall: true, soundUrl: 'sounds/lion.mp3',
    habitat: 'savanna',
    habitatQuestion: '獅子住在哪裡呢？', habitatPraise: '對了！獅子住在大草原！', tintable: false },
  { id: 'panda', name: '熊貓', sound: '嗯～嗯～', hasCall: false, habitat: 'bamboo',
    habitatQuestion: '熊貓喜歡在哪裡吃竹子呢？', habitatPraise: '對了！熊貓在竹林裡吃竹子！', tintable: false },
  { id: 'giraffe', name: '長頸鹿', sound: '嚼嚼～嚼嚼～', hasCall: false, habitat: 'savanna',
    habitatQuestion: '長頸鹿喜歡在哪裡吃樹葉呢？', habitatPraise: '對了！長頸鹿在大草原吃高高的樹葉！', tintable: false },
  { id: 'penguin', name: '企鵝', sound: '啪搭！啪搭！', hasCall: false, soundUrl: 'sounds/penguin.mp3',
    habitat: 'ice',
    habitatQuestion: '企鵝住在哪裡呢？', habitatPraise: '對了！企鵝住在冷冷的冰天雪地！', tintable: false },
  { id: 'turtle', name: '烏龜', sound: '慢慢爬～慢慢爬～', hasCall: false, habitat: 'pond',
    habitatQuestion: '烏龜喜歡在哪裡游泳呢？', habitatPraise: '對了！烏龜在池塘裡慢慢游！', tintable: false },
];

export const SPECIES_NAMES: Record<Species, string> = {
  ...(Object.fromEntries(ANIMALS.map((a) => [a.id, a.name])) as Record<AnimalId, string>),
  bird: '小鳥',
};

export const HABITATS: Record<HabitatId, { name: string }> = {
  pond: { name: '池塘' },
  tree: { name: '樹上' },
  doghouse: { name: '狗屋' },
  barn: { name: '農場' },
  savanna: { name: '大草原' },
  bamboo: { name: '竹林' },
  carrots: { name: '紅蘿蔔田' },
  bed: { name: '小床' },
  ice: { name: '冰天雪地' },
};

export const getAnimal = (id: AnimalId): AnimalInfo => ANIMALS.find((a) => a.id === id)!;
