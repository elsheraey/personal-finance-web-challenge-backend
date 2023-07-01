import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  @IsPositive()
  monthlyDeposit: number;
}
