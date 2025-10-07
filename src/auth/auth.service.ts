import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserSinguService } from '../usersingu/usersingu.service';
import { AuthResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { md5 } from 'src/util/md5';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly userSinguService: UserSinguService,
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

  async singIn(login: string, senha: string): Promise<AuthResponseDto> {
    const loginFound = await this.userSinguService.findByLogin(login);

    const senhaHash = md5(senha);

    if (!loginFound || senhaHash != loginFound.senha) {
      throw new UnauthorizedException();
    }

    const usuarioFrota = await this.usersService.findById(loginFound.idPessoa);

    if (!usuarioFrota) {
      throw new UnauthorizedException('Usuário não cadastrado no Frotas');
    }
    

    const payload = {
      sub: usuarioFrota.idUsuario,
      login: loginFound.login,
      nome: loginFound.nome,
      permissao: usuarioFrota.permissao,
      idUsuario: usuarioFrota.idUsuario,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.jwtExpirationTimeInSeconds}s`,
    });

    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
      username: loginFound.login,
      permissao: usuarioFrota.permissao,
      nome: loginFound.nome,
      email: loginFound.email,
      idUsuario: usuarioFrota.idUsuario,
    };
  }
}
