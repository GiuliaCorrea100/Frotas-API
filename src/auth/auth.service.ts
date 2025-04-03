/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const expirationTime = this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
    if (expirationTime === undefined) {
      throw new Error('JWT_EXPIRATION_TIME is not configured');
    }
    this.jwtExpirationTimeInSeconds = +expirationTime;
  }

  async signIn(username: string, password: string): Promise<AuthResponseDto> {
    const foundUser = await this.usersService.findByUsername(username);
    if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: foundUser.id, username: foundUser.username };

    const token = this.jwtService.sign(payload);
    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
