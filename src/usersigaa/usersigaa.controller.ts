import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { UsersigaaService } from './usersigaa.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('userSigaa')
export class UserSigaaController {
  constructor(private readonly usuarioService: UsersigaaService) {}

  @Get()
  async findByNome(@Query('nome') nome: string) {
    if (!nome || nome.length < 3) {
      return [];
    }

    const nomeNormalizado = nome.toLowerCase();

    return this.usuarioService.findByNomeSimilar(nomeNormalizado);
  }
}
