/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Recaptcha, RecaptchaResult } from '@nestlab/google-recaptcha';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Recaptcha()
  async signIn(
    @Request() req,
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<AuthResponseDto> {

    // const recaptchaResult = req.recaptchaValidationResult;
    // console.log('reCAPTCHA Validation Result:', recaptchaResult);

    return this.authService.signIn(username, password);    
  }

  @Post('renew-token')
  @HttpCode(HttpStatus.OK)
  async renewToken(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }
    const token = authHeader.split(' ')[1]; // Remove 'Bearer '
    return this.authService.renewToken(token);
  }

  @Get('mode')
  getAuthMode(): { mode: string } {
    return { mode: process.env.AUTH || 'SIGAA' };
  }
}