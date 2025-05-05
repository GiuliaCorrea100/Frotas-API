import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersinguModule } from 'src/usersingu/usersingu.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: +configService.get<number>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UsersinguModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
