import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class RefreshDto {
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
