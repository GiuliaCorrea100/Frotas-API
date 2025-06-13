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
    //passo 1: Autenticar no Singu
    const loginFound = await this.userSinguService.findByLogin(login);

    const senhaHash = md5(senha);

    if (!loginFound || senhaHash != loginFound.senha) {
      throw new UnauthorizedException();
    }

    //passo 2: verificar se o usuário existe no sistema
    const usuarioFrota = await this.usersService.findById(loginFound.idPessoa);

    if (!usuarioFrota) {
      throw new UnauthorizedException('Usuário não cadastrado no Frotas');
    }

    //Passo 3: gerar o token JWT com informações do Frotas
    const payload = {
      sub: usuarioFrota.idUsuario, //id no banco frota
      login: loginFound.login,
      permissao: usuarioFrota.permissao, //permissões específicas do frota
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
    };
  }
}
