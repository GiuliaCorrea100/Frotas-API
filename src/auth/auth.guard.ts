import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET'); // Pega a chave secreta do JWT do arquivo .env
  }

  async canActivate(
    // O método canActivate é chamado para verificar se o usuário está autenticado
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      request['user'] = payload; // Adiciona o payload ao request para que possa ser acessado em outros lugares
      // usuario autenticado
      return true;
    } catch {
      // Se o token não for válido, lança uma exceção de não autorizado
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') || [];
    return type === 'Bearer' ? token : undefined; //
    // Se o tipo for Bearer, retorna o token, caso contrário retorna undefined
    // bearer é o tipo de autenticação que estamos usando
  }
}
