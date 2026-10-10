export type Species =
  | 'dog' | 'cat' | 'rabbit' | 'duck' | 'chick' | 'cow'
  | 'sheep' | 'pig' | 'elephant' | 'lion' | 'monkey' | 'panda' | 'bird';

export type AnimalId = Exclude<Species, 'bird'>;

export type HabitatId = 'pond' | 'tree' | 'doghouse' | 'barn' | 'savanna' | 'bamboo' | 'carrots' | 'bed';

export interface AnimalInfo {
  id: AnimalId;
  name: string;
  /** 叫聲（由語音念出） */
  sound: string;
  /** 是否有大家熟悉的叫聲，可用於「聽聲音找動物」 */
  hasCall: boolean;
  /** 選用：放入真實錄音檔（例如 'sounds/dog.mp3'）後會優先播放 */
  soundUrl?: string;
  habitat: HabitatId;
  habitatQuestion: string;
  habitatPraise: string;
  /** 換顏色後仍然好辨認，可用於「小小挑戰」的顏色題 */
  tintable: boolean;
}

/** 依難度解鎖的順序排列：前 4 隻 = 初級、前 8 隻 = 中級、全部 = 進階 */
export const ANIMALS: AnimalInfo[] = [
  { id: 'dog', name: '小狗', sound: '汪！汪！', hasCall: true, habitat: 'doghouse',
    habitatQuestion: '小狗的家在哪裡呢？', habitatPraise: '對了！小狗住在狗屋裡！', tintable: true },
  { id: 'cat', name: '小貓', sound: '喵～喵～', hasCall: true, habitat: 'bed',
    habitatQuestion: '小貓喜歡在哪裡睡覺呢？', habitatPraise: '對了！小貓在軟軟的小床睡覺！', tintable: true },
  { id: 'rabbit', name: '小兔子', sound: '蹦！蹦！蹦！', hasCall: false, habitat: 'carrots',
    habitatQuestion: '小兔子喜歡在哪裡吃紅蘿蔔呢？', habitatPraise: '對了！小兔子在紅蘿蔔田吃紅蘿蔔！', tintable: true },
  { id: 'duck', name: '小鴨', sound: '呱！呱！呱！', hasCall: true, habitat: 'pond',
    habitatQuestion: '小鴨喜歡在哪裡游泳呢？', habitatPraise: '對了！小鴨在池塘裡游泳！', tintable: true },
  { id: 'chick', name: '小雞', sound: '啾！啾！啾！', hasCall: true, habitat: 'barn',
    habitatQuestion: '小雞住在哪裡呢？', habitatPraise: '對了！小雞住在農場裡！', tintable: true },
  { id: 'cow', name: '小牛', sound: '哞～哞～', hasCall: true, habitat: 'barn',
    habitatQuestion: '小牛住在哪裡呢？', habitatPraise: '對了！小牛住在農場裡！', tintable: false },
  { id: 'sheep', name: '小羊', sound: '咩～咩～', hasCall: true, habitat: 'barn',
    habitatQuestion: '小羊住在哪裡呢？', habitatPraise: '對了！小羊住在農場裡！', tintable: false },
  { id: 'pig', name: '小豬', sound: '齁！齁！齁！', hasCall: true, habitat: 'barn',
    habitatQuestion: '小豬住在哪裡呢？', habitatPraise: '對了！小豬住在農場裡！', tintable: true },
  { id: 'elephant', name: '大象', sound: '叭噗～叭噗～', hasCall: true, habitat: 'savanna',
    habitatQuestion: '大象喜歡在哪裡散步呢？', habitatPraise: '對了！大象在大草原散步！', tintable: false },
  { id: 'lion', name: '獅子', sound: '吼～吼～', hasCall: true, habitat: 'savanna',
    habitatQuestion: '獅子住在哪裡呢？', habitatPraise: '對了！獅子住在大草原！', tintable: false },
  { id: 'monkey', name: '猴子', sound: '吱吱！吱吱！', hasCall: true, habitat: 'tree',
    habitatQuestion: '猴子喜歡在哪裡爬來爬去呢？', habitatPraise: '對了！猴子在樹上爬來爬去！', tintable: false },
  { id: 'panda', name: '熊貓', sound: '嗯～嗯～', hasCall: false, habitat: 'bamboo',
    habitatQuestion: '熊貓喜歡在哪裡吃竹子呢？', habitatPraise: '對了！熊貓在竹林裡吃竹子！', tintable: false },
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
};

export const getAnimal = (id: AnimalId): AnimalInfo => ANIMALS.find((a) => a.id === id)!;
