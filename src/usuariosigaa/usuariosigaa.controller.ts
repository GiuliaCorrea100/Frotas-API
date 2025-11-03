/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { UsuarioSigaaService } from './usuariosigaa.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuarioSigaa')
export class UsuarioSigaaController {
  constructor(private readonly usuarioSigaaService: UsuarioSigaaService) {}

  @Get()
  async findByNome(@Query('nome') nome: string) {
    if (!nome || nome.length < 3) {
      return [];
    }

    const nomeNormalizado = nome.toLowerCase();

    return this.usuarioSigaaService.findByNomeSimilar(nomeNormalizado);
  }

  @Get('conferir-senha/:idPessoaSigaa/:senha')
  async confirmarSenha(
    @Param('idPessoaSigaa') idPessoaSigaa: number,
    @Param('senha') senha: string,
  ): Promise<boolean> {
    return this.usuarioSigaaService.confirmarSenha(idPessoaSigaa, senha);
  }
}
