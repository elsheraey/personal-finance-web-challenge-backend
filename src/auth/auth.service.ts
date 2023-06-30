import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto, RefreshDto } from './auth.dto';
import { JwtPayload } from './jwt-payload.interface';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });
  }

  async generateTokens(user: User, jti: string = crypto.randomUUID()) {
    const accessToken = this.generateAccessToken({ sub: user.id, jti });
    const refreshToken = this.generateRefreshToken({ sub: user.id, jti });

    await this.prismaService.refreshToken.upsert({
      where: { jti },
      create: { userId: user.id, token: refreshToken, jti },
      update: { token: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async register({ email, password }: AuthDto) {
    let user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      throw new ConflictException('Email is already in use');
    }

    user = await this.prismaService.user.create({
      data: {
        email,
        hash: await this.passwordService.hash(password),
      },
    });

    return await this.generateTokens(user);
  }

  async login({ email, password }: AuthDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await this.passwordService.verify(user.hash, password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.generateTokens(user);
  }

  async refresh({ refreshToken }: RefreshDto) {
    const dbToken = await this.prismaService.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!dbToken) {
      try {
        const { jti } = this.jwtService.verify(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });

        await this.prismaService.refreshToken.deleteMany({ where: { jti } });
      } catch (e) {
        throw new UnauthorizedException('Invalid refreshToken');
      }

      throw new UnauthorizedException('refreshToken not found');
    } else {
      return await this.generateTokens(dbToken.user, dbToken.jti);
    }
  }
}
