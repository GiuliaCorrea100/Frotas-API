/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<AuthResponseDto> {
    return this.authService.signIn(username, password);    
  }

  @Get('mode')
  getAuthMode(): { mode: string } {
    return { mode: process.env.AUTH || 'SIGAA' };
  }
}