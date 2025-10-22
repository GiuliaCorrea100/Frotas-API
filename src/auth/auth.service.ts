import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { md5 } from 'src/util/md5';
import { UsuarioSigaaService } from 'src/usuariosigaa/usuariosigaa.service';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioSigaaService: UsuarioSigaaService,
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
    const loginFound = await this.usuarioSigaaService.findByUserLogin(login);

    const senhaHash = md5(senha);

    if (!loginFound || senhaHash != loginFound.senha) {
      throw new UnauthorizedException();
    }

    let usuarioFrota = await this.usuarioService.findByIdPessoaSigaa(
      loginFound.idPessoaSigaa,
    );

    if (!usuarioFrota) {
      const novoUsuario = {
        idPessoaSigaa: loginFound.idPessoaSigaa,
        administrador: false,
        nome: loginFound.nome,
      };
      usuarioFrota = await this.usuarioService.create(novoUsuario);
      console.log(
        `Usuário ${usuarioFrota.idUsuario} cadastrado. Nome: ${usuarioFrota.nome}.`,
      );
    }

    const payload = {
      sub: usuarioFrota.idUsuario,
      login: loginFound.login,
      nome: loginFound.nome,
      administrador: usuarioFrota.administrador,
      idUsuario: usuarioFrota.idUsuario,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.jwtExpirationTimeInSeconds}s`,
    });

    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
      username: loginFound.login,
      administrador: usuarioFrota.administrador,
      nome: loginFound.nome,
      email: loginFound.email,
      idUsuario: usuarioFrota.idUsuario,
    };
  }
}
