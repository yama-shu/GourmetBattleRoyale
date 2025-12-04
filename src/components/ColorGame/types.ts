export type GameState = 'LOBBY' | 'WAITING' | 'PLAY' | 'GAME_OVER';
export type QuestionType = 'TEXT' | 'COLOR';
export type PlayerRole = 'HOST' | 'GUEST'; // PlayerRoleもエクスポート

// --- 既存の型 ---
export type ColorDefinition = {
  id: string;
  name: string;
  hex: string;
};

export interface Question { // Questionもエクスポート
  text: ColorDefinition;
  color: ColorDefinition;
  type: QuestionType;
}

// --- 拡張した型 ---
export interface Shop {
  id: string;
  name: string;
  url: string;
  photoUrl: string;
  genre: string;
}

export interface Player {
  name: string;
  score: number;
  combo: number;
  alive: boolean;
  selectedShopId: string | null;
}

export interface RoomData {
  status: 'WAITING' | 'PLAY' | 'FINISHED';
  gameType: 'COLOR_MATCH'; 
  players: {
    [key: string]: Player;
  };
  shopCandidates: Shop[];
  winnerSelectionId: string | null;
  startTime?: number; 
}