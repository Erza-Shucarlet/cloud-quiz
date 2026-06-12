import { Character, Question, GameState } from './types';

/**
 * 角色数据 — 由 scripts/generate-manifest.ts 自动生成
 * 手动编辑后也可用，格式：{ name: string, images: string[] }
 */
const characters: Character[] = [
  {
    id: 'yundao',
    name: '云导',
    images: [
      '01_邪魅挑眉.png',
      '02_调皮眨眼.png',
      '04_假装无辜.png',
      '05_胜券在握.png',
      '06_邪魅挑眉.png',
      '07_调皮眨眼.png',
      '08_腹黑低笑.png',
      '09_假装无辜.png',
      '10_胜券在握.png',
    ],
  },
  {
    id: 'yunmi',
    name: '云米',
    images: [
      '01_元气大笑.png',
      '21_元气大笑.png',
      '22_俏皮比心.png',
      '23_小恶作剧.png',
      '24_委屈撒娇.png',
      '25_惊喜闪亮.png',
    ],
  },
  {
    id: 'yunzi',
    name: '云子',
    images: [
      '16_认真待命.png',
      '17_温柔问候.png',
      '18_慌乱道歉.png',
      '19_努力鼓劲.png',
      '20_被夸害羞.png',
    ],
  },
  {
    id: 'yunxi',
    name: '云汐',
    images: [
      '26_清爽微笑.png',
      '27_天然呆发愣.png',
      '28_开朗招呼.png',
      '29_不好意思挠脸.png',
      '30_突然顿悟.png',
    ],
  },
  {
    id: 'yunlan',
    name: '云岚',
    images: [
      '31_冷静审视.png',
      '32_御姐浅笑.png',
      '33_严肃提醒.png',
      '34_疲惫叹息.png',
      '35_从容赞许.png',
    ],
  },
  {
    id: 'yunbao',
    name: '云宝',
    images: [
      '06_高贵淡笑.png',
      '07_傲娇别脸.png',
      '08_神秘低语.png',
      '09_不悦轻哼.png',
      '10_被逗破防.png',
      '36_高贵淡笑.png',
      '37_傲娇别脸.png',
      '38_神秘低语.png',
      '39_不悦轻哼.png',
      '40_被逗破防.png',
    ],
  },
  {
    id: 'yunduo',
    name: '云朵',
    images: [
      '11_空灵凝望.png',
      '12_梦中微笑.png',
      '13_安静闭眼.png',
      '14_轻微惊讶.png',
      '15_朦胧忧思.png',
    ],
  },
  {
    id: 'yunrou',
    name: '云柔',
    images: [
      '01_软萌微笑.png',
      '02_害羞低眸.png',
      '03_天真好奇.png',
      '04_治愈安慰.png',
      '05_小小困惑.png',
    ],
  },
];

/** 获取图片完整路径 */
export function getImagePath(characterName: string, filename: string): string {
  return `/images/characters/${characterName}/${filename}`;
}

/** 获取所有角色 */
export function getAllCharacters(): Character[] {
  return characters;
}

/** 获取指定角色 */
export function getCharacterByName(name: string): Character | undefined {
  return characters.find((c) => c.name === name);
}
