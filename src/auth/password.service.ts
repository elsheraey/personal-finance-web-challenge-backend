import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { argon2id, hash, Options, verify } from 'argon2';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  get getArginOptions(): Options & { raw?: false } {
    const secret = this.configService.get<string>('ARGON2_SECRET');

    return {
      type: argon2id,
      memoryCost: 2 ** 16,
      hashLength: 50,
      secret: Buffer.from(secret),
    };
  }

  verify(hash: string, password: string) {
    return verify(hash, password, this.getArginOptions);
  }

  hash(password: string) {
    return hash(password, this.getArginOptions);
  }
}
