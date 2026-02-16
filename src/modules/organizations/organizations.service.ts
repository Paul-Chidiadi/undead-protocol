import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './organizations.repository';
import {
  Organization,
  OrganizationDocument,
} from './entities/organizations.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { FindType } from 'src/database/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  BattleState,
  Room,
  RoomDocument,
} from '../rooms/entities/rooms.entity';
import {
  LeaderboardQueryDto,
  LeaderboardResponseDto,
  PlayerStats,
} from './dto/leaderboard.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  // Create a new Organization record
  async create(data: Partial<Organization>) {
    try {
      const createdOrganization =
        await this.organizationRepository.create(data);
      return createdOrganization;
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('Organization data already exist');
      throw new BadRequestException('Error occur while creating Organization');
    }
  }

  // Fetch a single Organization record
  async findOne(
    data: FilterQuery<Organization>,
    options: FindType<Organization> = {},
  ) {
    const result = await this.organizationRepository.findOne(
      {
        ...data,
      },
      { ...options },
    );
    if (!result) {
      throw new NotFoundException('Organization not found');
    }
    return result;
  }

  async deleteOne(
    data: FilterQuery<Organization>,
    options: FindType<Organization> = {},
  ) {
    const result = await this.organizationRepository.deleteOne({
      ...data,
    });
    return result;
  }

  async find(
    data: FilterQuery<Organization>,
    options: FindType<Organization> = {},
  ) {
    return await this.organizationRepository.find(
      {
        ...data,
      },
      { ...options },
    );
  }

  async update(
    filterData: FilterQuery<Organization>,
    update: UpdateQuery<Organization> = {},
  ) {
    const existingOrganization = await this.organizationRepository.update(
      { ...filterData },
      { $set: { ...update } },
    );
    if (!existingOrganization) {
      throw new NotFoundException('Organization not found');
    }
    return existingOrganization;
  }

  async getOrganizationLeaderboard(
    query: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const { organizationId, limit = 10, minBattles = 1 } = query;

    // Validate organization exists
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Fetch all completed battles for the organization
    const rooms = await this.roomModel
      .find({
        organization: organizationId,
        state: BattleState.Completed,
      })
      .exec();

    if (rooms.length === 0) {
      return {
        organizationId,
        organizationName: organization.organizationName,
        totalPlayers: 0,
        totalBattles: 0,
        generatedAt: new Date(),
        leaderboard: [],
      };
    }

    // Build player statistics map
    const playerStatsMap = this.buildPlayerStatsMap(rooms);

    // Convert map to array and calculate composite scores
    const playerStatsArray = Array.from(playerStatsMap.values())
      .filter((stats) => stats.totalBattles >= minBattles)
      .map((stats) => ({
        ...stats,
        score: this.calculateCompositeScore(stats),
      }));

    // Sort by score (descending) and assign ranks
    playerStatsArray.sort((a, b) => b.score - a.score);
    playerStatsArray.forEach((stats, index) => {
      stats.rank = index + 1;
    });

    // Get top N players
    const topPlayers = playerStatsArray.slice(0, limit);

    return {
      organizationId,
      organizationName: organization.organizationName,
      totalPlayers: playerStatsMap.size,
      totalBattles: rooms.length,
      generatedAt: new Date(),
      leaderboard: topPlayers,
    };
  }

  private buildPlayerStatsMap(rooms: RoomDocument[]): Map<string, PlayerStats> {
    const statsMap = new Map<string, PlayerStats>();

    rooms.forEach((room) => {
      // Process Player A
      if (room.playerA && room.warriorA) {
        this.updatePlayerStats(
          statsMap,
          room.playerA,
          room.playerACorrect,
          room.playerAAnswers.filter((a) => a !== null).length,
          this.determineOutcome(room, 'A'),
        );
      }

      // Process Player B
      if (room.playerB && room.warriorB) {
        this.updatePlayerStats(
          statsMap,
          room.playerB,
          room.playerBCorrect,
          room.playerBAnswers.filter((a) => a !== null).length,
          this.determineOutcome(room, 'B'),
        );
      }
    });

    return statsMap;
  }

  private updatePlayerStats(
    statsMap: Map<string, PlayerStats>,
    playerName: string,
    correctAnswers: number,
    totalAnswered: number,
    outcome: 'win' | 'loss' | 'draw',
  ): void {
    let stats = statsMap.get(playerName);

    if (!stats) {
      stats = {
        playerName,
        totalBattles: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0,
        accuracy: 0,
        winRate: 0,
        averageCorrectPerBattle: 0,
        rank: 0,
        score: 0,
      };
      statsMap.set(playerName, stats);
    }

    // Update statistics
    stats.totalBattles++;
    stats.totalCorrectAnswers += correctAnswers;
    stats.totalQuestions += totalAnswered;

    if (outcome === 'win') stats.wins++;
    else if (outcome === 'loss') stats.losses++;
    else stats.draws++;

    // Calculate derived metrics
    stats.accuracy =
      stats.totalQuestions > 0
        ? (stats.totalCorrectAnswers / stats.totalQuestions) * 100
        : 0;
    stats.winRate =
      stats.totalBattles > 0 ? (stats.wins / stats.totalBattles) * 100 : 0;
    stats.averageCorrectPerBattle =
      stats.totalBattles > 0
        ? stats.totalCorrectAnswers / stats.totalBattles
        : 0;
  }

  private determineOutcome(
    room: RoomDocument,
    player: 'A' | 'B',
  ): 'win' | 'loss' | 'draw' {
    const playerKey = player === 'A' ? room.playerA : room.playerB;

    if (!room.winner) {
      // No winner means draw
      return 'draw';
    }

    if (room.winner === playerKey) {
      return 'win';
    }

    return 'loss';
  }

 private calculateCompositeScore(stats: PlayerStats): number {
  // WINS is the primary driver.
  const winPoints = stats.wins * 300;

  // WIN RATE — rewards sustained dominance, not just lucky one-offs.
 
  const winRateBonus =
    stats.totalBattles >= 3
      ? stats.winRate * 2
      : stats.winRate * 0.5;

  // ACCURACY — meaningful tiebreaker between players with equal wins.

  const accuracyBonus = stats.accuracy * 1.5;

  // PARTICIPATION — incentivises continued play, with a meaningful cap.
  const participationBonus = Math.min(stats.totalBattles * 15, 300);

  return winPoints + winRateBonus + accuracyBonus + participationBonus;
}


  async getPlayerStats(
    organizationId: string,
    playerName: string,
  ): Promise<PlayerStats | null> {
    const leaderboard = await this.getOrganizationLeaderboard({
      organizationId,
      limit: 999999, // Get all players
    });

    return (
      leaderboard.leaderboard.find((p) => p.playerName === playerName) || null
    );
  }

  async getTopPerformers(
    organizationId: string,
    category: 'accuracy' | 'wins' | 'battles',
    limit: number = 10,
  ): Promise<PlayerStats[]> {
    const leaderboard = await this.getOrganizationLeaderboard({
      organizationId,
      limit: 999999,
    });

    const sorted = [...leaderboard.leaderboard].sort((a, b) => {
      switch (category) {
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'wins':
          return b.wins - a.wins;
        case 'battles':
          return b.totalBattles - a.totalBattles;
        default:
          return 0;
      }
    });

    return sorted.slice(0, limit).map((stats, index) => ({
      ...stats,
      rank: index + 1,
    }));
  }
}
