import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateGoalDto } from './goals.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: User, dto: CreateGoalDto) {
    return await this.prismaService.goal.create({
      data: {
        userId: user.id,
        ...dto,
      },
    });
  }

  async getUserGoals(userId: number) {
    return await this.prismaService.goal.findMany({
      where: {
        userId,
      },
    });
  }
}
