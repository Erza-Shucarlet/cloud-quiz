/** 角色定义 */
export interface Character {
  id: string;
  name: string;
  images: string[];
}

/** 单道题目 */
export interface Question {
  /** 目标角色名 */
  targetName: string;
  /** 目标角色 ID */
  targetId: string;
  /** 三张候选图片路径（打乱顺序） */
  options: string[];
  /** 正确答案的图片路径 */
  correctImage: string;
}

/** 游戏状态 */
export interface GameState {
  nickname: string;
  questions: Question[];
  currentIndex: number;
  answers: (string | null)[]; // 每道题选择的图片路径
  score: number;
  startTime: number;
  endTime?: number;
  isFinished: boolean;
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  id?: number;
  nickname: string;
  score: number;
  time_seconds: number;
  date: string;
  rank?: number;
}
