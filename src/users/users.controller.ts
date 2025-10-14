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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindAllParameters, UsersDto, UsersRouteParameters } from './users.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: UsersDto, @Request() req: any): Promise<UsersDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.usersService.create(user, currentUserId, currentUserName);
  }

  @Get('/:idPessoaSigaa')
  async findByIdPessoaSigaa(
    @Param('idPessoaSigaa') idPessoaSigaa: number,
  ): Promise<UsersDto> {
    return this.usersService.findByIdPessoaSigaa(idPessoaSigaa);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<UsersDto[]> {
    return this.usersService.findAll(params);
  }

  @Get('/buscar-por-nome/:nome')
  async findByName(@Param('nome') nome: string): Promise<UsersDto[]> {
    return this.usersService.findByName(nome);
  }

  @Get('/buscar-usuario/:idUsuario')
  async findUserId(
    @Param('idUsuario') idUsuario: number,
  ): Promise<UsersDto | null> {
    return this.usersService.findUserId(idUsuario);
  }

  @Patch('/mudar-permissao/:idPessoaSigaa')
  async permissaoAdm(
    @Param('idPessoaSigaa') idPessoaSigaa: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.usersService.permissaoAdm(
      idPessoaSigaa,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idUsuario')
  async update(
    @Param() params: UsersRouteParameters,
    @Body() users: UsersDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.usersService.update(
      params.idUsuario,
      users,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idUsuario')
  remove(@Param('idUsuario') idUsuario: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.usersService.remove(idUsuario, currentUserId, currentUserName);
  }
}
