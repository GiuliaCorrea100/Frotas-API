import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindAllParameters, UsersDto, UsersRouteParameters } from './users.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: UsersDto): Promise<UsersDto> {
    return await this.usersService.create(user);
  }

  @Get('/:idUsuario')
  async findById(@Param('idUsuario') idUsuario: number): Promise<UsersDto> {
    return this.usersService.findById(idUsuario);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<UsersDto[]> {
    return this.usersService.findAll(params);
  }

  //adicionei esse get natly
  @Get('/buscar-por-nome/:nome')
  async findByName(@Param('nome') nome: string): Promise<UsersDto[]> {
    return this.usersService.findByName(nome);
  }

  @Get('/buscar-singu/:idUsuario')
  async findUserSingu(@Param('idUsuario') idUsuario: number): Promise<number> {
    return this.usersService.findUserSingu(idUsuario);
  }

  @Patch('/mudar-permissao/:idPessoaSingu')
  async permissaoAdm(
    @Param('idPessoaSingu') idPessoaSingu: number,
  ): Promise<void> {
    await this.usersService.permissaoAdm(idPessoaSingu);
  }

  @Put('/:idUsuario')
  async update(@Param() params: UsersRouteParameters, @Body() users: UsersDto) {
    await this.usersService.update(params.idUsuario, users);
  }

  @Delete('/:idUsuario')
  remove(@Param('idUsuario') idUsuario: number) {
    return this.usersService.remove(idUsuario);
  }
}
