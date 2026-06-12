import { Character, Question, GameState } from './types';
import { getAllCharacters, getCharacterByName, getImagePath } from './characters';

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 从数组中随机选 N 个元素 */
function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** 生成一回合的 N 道题目（不重复图片） */
export function generateQuestions(charCount: number = 5): Question[] {
  const allChars = getAllCharacters();
  if (allChars.length < 3) {
    throw new Error('至少需要 3 个角色才能出题');
  }

  // 选取 charCount 个目标角色
  const targets = pickRandom(allChars, Math.min(charCount, allChars.length));
  const questions: Question[] = [];
  const usedImages = new Set<string>(); // 本轮已用图片路径

  for (const target of targets) {
    // 从目标角色中选一张没用过的正确图片
    const freshCorrectImgs = target.images.filter((img) => !usedImages.has(getImagePath(target.name, img)));
    const correctFilename = freshCorrectImgs.length > 0
      ? pickRandom(freshCorrectImgs, 1)[0]
      : pickRandom(target.images, 1)[0]; // 全部用过则回退
    const correctImage = getImagePath(target.name, correctFilename);
    usedImages.add(correctImage);

    // 从其他角色中各选一张没用过的图作为干扰项
    const others = shuffle(allChars.filter((c) => c.id !== target.id));
    const distractors: string[] = [];

    for (const other of others) {
      if (distractors.length >= 2) break;
      const freshImgs = other.images.filter((img) => !usedImages.has(getImagePath(other.name, img)));
      const pool = freshImgs.length > 0 ? freshImgs : other.images;
      const img = pickRandom(pool, 1)[0];
      const path = getImagePath(other.name, img);
      if (!usedImages.has(path)) {
        distractors.push(path);
        usedImages.add(path);
      }
    }

    // 去重保护：不足 2 个时补任意
    while (distractors.length < 2) {
      const fallback = pickRandom(others, 1)[0];
      const img = pickRandom(fallback.images, 1)[0];
      const path = getImagePath(fallback.name, img);
      if (!distractors.includes(path)) distractors.push(path);
    }

    const options = shuffle([correctImage, ...distractors]);
    questions.push({
      targetName: target.name,
      targetId: target.id,
      options,
      correctImage,
    });
  }

  return questions;
}

/** 检查答案是否正确 */
export function checkAnswer(question: Question, selectedImage: string): boolean {
  return selectedImage === question.correctImage;
}

/** 计算得分 */
export function calculateScore(questions: Question[], answers: (string | null)[]): number {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] && checkAnswer(questions[i], answers[i]!)) {
      score += 20;
    }
  }
  return score;
}

/** 计算用时（秒） */
export function calculateTime(startTime: number, endTime: number): number {
  return Math.round((endTime - startTime) / 1000);
}

/** 格式化用时 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) {
    return `${m}分${s.toString().padStart(2, '0')}秒`;
  }
  return `${s}秒`;
}

/** 创建新游戏 */
export function createGame(nickname: string, questionCount: number = 5): GameState {
  const questions = generateQuestions(questionCount);
  return {
    nickname,
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    score: 0,
    startTime: Date.now(),
    isFinished: false,
  };
}

/** 提交答案并返回是否结束 */
export function submitAnswer(
  state: GameState,
  selectedImage: string
): { isCorrect: boolean; isFinished: boolean; state: GameState } {
  const currentQ = state.questions[state.currentIndex];
  const isCorrect = checkAnswer(currentQ, selectedImage);

  const newAnswers = [...state.answers];
  newAnswers[state.currentIndex] = selectedImage;

  const isLast = state.currentIndex >= state.questions.length - 1;

  const newState: GameState = {
    ...state,
    answers: newAnswers,
    score: isCorrect ? state.score + 20 : state.score,
    currentIndex: isLast ? state.currentIndex : state.currentIndex + 1,
    endTime: isLast ? Date.now() : undefined,
    isFinished: isLast,
  };

  return { isCorrect, isFinished: isLast, state: newState };
}
