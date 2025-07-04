import { Controller, Get, Param } from '@nestjs/common';
import { UserSinguDto } from './usersingu.dto';
import { UserSinguService } from './usersingu.service';

@Controller('usersingu')
export class UsersinguController {
  constructor(private readonly UserSinguService: UserSinguService) {}

  @Get('/:login')
  async findByLogin(@Param('login') login: string): Promise<UserSinguDto> {
    return this.UserSinguService.findByLogin(login);
  }

  @Get('/buscar-id/:idPessoa')
  async findById(@Param('idPessoa') idPessoa: number): Promise<UserSinguDto> {
    return await this.UserSinguService.findById(idPessoa);
  }

  @Get('/buscarPorNome/:nome')
  async buscarPorNome(@Param('nome') nome: string): Promise<UserSinguDto[]> {
    return this.UserSinguService.buscarPorNome(nome);
  }

  @Get('buscar-nome/:nome')
  async findbyNome(@Param('nome') nome: string): Promise<UserSinguDto[]> {
    if (!nome || nome.length < 3) {
      return [];
    }

    return await this.UserSinguService.findByNome(nome.trim());
  }

  @Get('conferir-senha/:idPessoa/:senha')
  async confirmarSenha(
    @Param('idPessoa') idPessoa: number,
    @Param('senha') senha: string,
  ): Promise<boolean> {
    return this.UserSinguService.confirmarSenha(idPessoa, senha);
  }
}
