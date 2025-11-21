export class LeaderboardQueryDto {
  organizationId: string;
  limit?: number = 10;
  minBattles?: number = 1;
}

export class PlayerStats {
  playerName: string;
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  accuracy: number;
  winRate: number;
  averageCorrectPerBattle: number;
  rank: number;
  score: number; // Composite score for ranking
}

export class LeaderboardResponseDto {
  organizationId: string;
  organizationName?: string;
  totalPlayers: number;
  totalBattles: number;
  generatedAt: Date;
  leaderboard: PlayerStats[];
}
