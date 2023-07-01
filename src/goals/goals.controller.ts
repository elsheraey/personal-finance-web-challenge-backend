import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateGoalDto } from './goals.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Req() { user }, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(user, dto);
  }

  @Get()
  getUserGoals(@Req() { user }) {
    return this.goalsService.getUserGoals(user.id);
  }
}
