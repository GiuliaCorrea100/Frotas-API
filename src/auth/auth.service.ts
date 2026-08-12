/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { md5 } from 'src/util/md5';
import { UsuarioSigaaService } from 'src/usuariosigaa/usuariosigaa.service';
import { GoogleRecaptchaValidator } from '@nestlab/google-recaptcha';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioSigaaService: UsuarioSigaaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly recaptchaValidator: GoogleRecaptchaValidator,

  ) {
    const expirationTime = this.configService.get<number>('JWT_EXPIRATION_TIME');
    if (expirationTime === undefined) {
      throw new Error('JWT_EXPIRATION_TIME is not configured');
    }
    this.jwtExpirationTimeInSeconds = +expirationTime;
  }

  async signIn(login: string, senha: string): Promise<AuthResponseDto> {
    if (process.env.AUTH === 'SIGAA') {
      console.log('Autenticação via SIGAA...');
      return this.signInSigaa(login, senha);
    } else {
      console.log('Autenticação MOCK...');
      return this.signInMock(login, senha);
    }
  }

  async signInSigaa(login: string, senha: string): Promise<AuthResponseDto> {
    try {
      const loginFound = await this.usuarioSigaaService.findByUserLogin(login);
      const senhaHash = md5(senha);

      if (!loginFound || senhaHash !== loginFound.senha) {
        throw new UnauthorizedException('Usuário ou Senha inválido');
      }

      let usuarioFrota = await this.usuarioService.findByIdPessoaSigaa(
        loginFound.idPessoaSigaa,
      );

      if (!usuarioFrota) {
        const novoUsuario = {
          idPessoaSigaa: loginFound.idPessoaSigaa,
          administrador: false,
          nome: loginFound.nome,
          email: loginFound.email,
        };
        usuarioFrota = await this.usuarioService.create(novoUsuario);
      } else {
        // Caso o usuário já exista, confere o e-mail (atual do SIGAA e Frotas) para atualizar caso seja necessário
        if (
          loginFound.email &&
          loginFound.email !== usuarioFrota.email
        ) {
          usuarioFrota = await this.usuarioService.update(
            usuarioFrota.idUsuario,
            { ...usuarioFrota, email: loginFound.email },
          );
        }
      }

      const payload = {
        sub: usuarioFrota.idUsuario,
        login: loginFound.login,
        nome: loginFound.nome,
        administrador: usuarioFrota.administrador,
        idUsuario: usuarioFrota.idUsuario,
        email: loginFound.email,
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
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro na autenticação SIGAA:', error.message);
      } else {
        console.error('Erro na autenticação SIGAA:', error);
      }
      throw new UnauthorizedException('Falha na autenticação SIGAA. Verifique as configurações do ambiente.');
    }
  }

  async signInMock(login: string, senha: string): Promise<AuthResponseDto> {
    // Usuários de teste pré-definidos
    const usuarios = [
      {
        login: '11111111111',
        password: 'secret',
        administrador: true,
        nome: 'ADMINISTRADOR FROTAS',
        idUsuario: 1,
        email: 'giuliarafaela32@gmail.com',
        idPessoaSigaa: 999998, // ID fictício
      },
      {
        login: '22222222222',
        password: 'secret',
        administrador: false,
        nome: 'MOTORISTA FROTAS',
        idUsuario: 2,
        email: 'giuliarafaela32@gmail.com',
        idPessoaSigaa: 999999, // ID fictício
      },
    ];

    const usuario = usuarios.find((u) => u.login === login);

    // Verificar se o usuário existe e a senha corresponde
    if (!usuario || md5(senha) !== md5(usuario.password)) {
      throw new UnauthorizedException('Credenciais inválidas no modo teste');
    }

    const payload = {
      sub: usuario.idUsuario,
      login: usuario.login,
      nome: usuario.nome,
      administrador: usuario.administrador,
      idUsuario: usuario.idUsuario,
      email: usuario.email,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: `${this.jwtExpirationTimeInSeconds}s`,
    });

    return {
      token,
      expiresIn: this.jwtExpirationTimeInSeconds,
      username: usuario.login,
      administrador: usuario.administrador,
      nome: usuario.nome,
      email: usuario.email,
      idUsuario: usuario.idUsuario,
    };
  }

  async renewToken(token: string): Promise<AuthResponseDto> {
    try {
      // Verifica se o token é válido e decodifica
      const decoded = this.jwtService.verify(token);
      
      // Verifica se tem os campos obrigatórios
      if (!decoded.sub || !decoded.login || !decoded.nome) {
        throw new UnauthorizedException('Token com dados incompletos');
      }

      // Gera novo token com os mesmos dados do token antigo
      const newToken = this.jwtService.sign(
        {
          sub: decoded.sub, // ID do usuário
          login: decoded.login, // Login/CPF
          nome: decoded.nome, // Nome completo
          administrador: decoded.administrador || false, // Permissão de admin
          idUsuario: decoded.idUsuario || decoded.sub, // ID do usuário (fallback)
          email: decoded.email || '', // Email
        },
        {
          expiresIn: `${this.jwtExpirationTimeInSeconds}s`,
        }
      );

      //console.log(`Token renovado para: ${decoded.nome} (${decoded.login})`);

      // Retorna os mesmos dados que estavam no token original
      return {
        token: newToken,
        expiresIn: this.jwtExpirationTimeInSeconds,
        username: decoded.login,
        administrador: decoded.administrador || false,
        nome: decoded.nome,
        email: decoded.email || '',
        idUsuario: decoded.idUsuario || decoded.sub,
      };
    } catch (error) {
      console.error('❌ Erro na renovação do token:', error);
      
    }
  }

}