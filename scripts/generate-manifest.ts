/**
 * 图片清单自动生成脚本
 *
 * 用法：npx tsx scripts/generate-manifest.ts
 * 功能：扫描 public/images/characters/ 目录，自动更新 lib/characters.ts 中的角色数据
 *
 * 当你在 public/images/characters/ 下新增角色文件夹或图片后运行此脚本，
 * 即可自动更新角色列表而无需手动编辑代码。
 */

import * as fs from 'fs';
import * as path from 'path';

const IMAGES_DIR = path.resolve(__dirname, '../public/images/characters');
const OUTPUT_FILE = path.resolve(__dirname, '../lib/characters.ts');

interface CharacterData {
  id: string;
  name: string;
  images: string[];
}

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '');
}

function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ 图片目录不存在:', IMAGES_DIR);
    process.exit(1);
  }

  const entries = fs.readdirSync(IMAGES_DIR, { withFileTypes: true });
  const characters: CharacterData[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const charDir = path.join(IMAGES_DIR, entry.name);
    const files = fs
      .readdirSync(charDir)
      .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
      .sort();

    if (files.length === 0) {
      console.warn(`⚠️ ${entry.name} 文件夹没有图片，跳过`);
      continue;
    }

    characters.push({
      id: generateId(entry.name),
      name: entry.name,
      images: files,
    });

    console.log(`✅ ${entry.name}: ${files.length} 张图片`);
  }

  // 生成 TypeScript 源码
  const charactersStr = characters
    .map(
      (c) => `  {
    id: '${c.id}',
    name: '${c.name}',
    images: [
      ${c.images.map((img) => `'${img}'`).join(',\n      ')}
    ],
  }`
    )
    .join(',\n');

  const output = `import { Character, Question, GameState } from './types';

/**
 * 角色数据 — 由 scripts/generate-manifest.ts 自动生成
 * 运行 scripts/generate-manifest.ts 来重新生成此文件
 */
const characters: Character[] = [
${charactersStr}
];

/** 获取图片完整路径 */
export function getImagePath(characterName: string, filename: string): string {
  return \`/images/characters/\${characterName}/\${filename}\`;
}

/** 获取所有角色 */
export function getAllCharacters(): Character[] {
  return characters;
}

/** 获取指定角色 */
export function getCharacterByName(name: string): Character | undefined {
  return characters.find((c) => c.name === name);
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\n✨ 已生成 ${OUTPUT_FILE}`);
  console.log(`   共 ${characters.length} 个角色`);
}

main();
