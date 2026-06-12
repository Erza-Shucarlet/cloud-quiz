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
      '01_邪魅挑眉.webp',
      '02_调皮眨眼.webp',
      '04_假装无辜.webp',
      '05_胜券在握.webp',
      '06_邪魅挑眉.webp',
      '07_调皮眨眼.webp',
      '08_腹黑低笑.webp',
      '09_假装无辜.webp',
      '10_胜券在握.webp',
    ],
  },
  {
    id: 'yunmi',
    name: '云米',
    images: [
      '01_元气大笑.webp',
      '21_元气大笑.webp',
      '22_俏皮比心.webp',
      '23_小恶作剧.webp',
      '24_委屈撒娇.webp',
      '25_惊喜闪亮.webp',
    ],
  },
  {
    id: 'yunzi',
    name: '云子',
    images: [
      '16_认真待命.webp',
      '17_温柔问候.webp',
      '18_慌乱道歉.webp',
      '19_努力鼓劲.webp',
      '20_被夸害羞.webp',
    ],
  },
  {
    id: 'yunxi',
    name: '云汐',
    images: [
      '26_清爽微笑.webp',
      '27_天然呆发愣.webp',
      '28_开朗招呼.webp',
      '29_不好意思挠脸.webp',
      '30_突然顿悟.webp',
    ],
  },
  {
    id: 'yunlan',
    name: '云岚',
    images: [
      '31_冷静审视.webp',
      '32_御姐浅笑.webp',
      '33_严肃提醒.webp',
      '34_疲惫叹息.webp',
      '35_从容赞许.webp',
    ],
  },
  {
    id: 'yunbao',
    name: '云宝',
    images: [
      '06_高贵淡笑.webp',
      '07_傲娇别脸.webp',
      '08_神秘低语.webp',
      '09_不悦轻哼.webp',
      '10_被逗破防.webp',
      '36_高贵淡笑.webp',
      '37_傲娇别脸.webp',
      '38_神秘低语.webp',
      '39_不悦轻哼.webp',
      '40_被逗破防.webp',
    ],
  },
  {
    id: 'yunduo',
    name: '云朵',
    images: [
      '11_空灵凝望.webp',
      '12_梦中微笑.webp',
      '13_安静闭眼.webp',
      '14_轻微惊讶.webp',
      '15_朦胧忧思.webp',
    ],
  },
  {
    id: 'yunrou',
    name: '云柔',
    images: [
      '01_软萌微笑.webp',
      '02_害羞低眸.webp',
      '03_天真好奇.webp',
      '04_治愈安慰.webp',
      '05_小小困惑.webp',
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
