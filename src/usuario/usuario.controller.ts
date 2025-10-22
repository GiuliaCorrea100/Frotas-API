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
import { UsuarioService } from './usuario.service';
import {
  FindAllParameters,
  UsuarioDto,
  UsersRouteParameters,
} from './usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuario')
@UseGuards(AuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() user: UsuarioDto,
    @Request() req: any,
  ): Promise<UsuarioDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.usuarioService.create(
      user,
      currentUserId,
      currentUserName,
    );
  }

  @Get('/:idPessoaSigaa')
  async findByIdPessoaSigaa(
    @Param('idPessoaSigaa') idPessoaSigaa: number,
  ): Promise<UsuarioDto> {
    return this.usuarioService.findByIdPessoaSigaa(idPessoaSigaa);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<UsuarioDto[]> {
    return this.usuarioService.findAll(params);
  }

  @Get('/buscar-por-nome/:nome')
  async findByName(@Param('nome') nome: string): Promise<UsuarioDto[]> {
    return this.usuarioService.findByName(nome);
  }

  @Get('/buscar-usuario/:idUsuario')
  async findUserId(
    @Param('idUsuario') idUsuario: number,
  ): Promise<UsuarioDto | null> {
    return this.usuarioService.findUserId(idUsuario);
  }

  @Get('/consultaCadastro/:idPessoaSigaa')
  async consultaCadastroUsuario(
    @Param('idPessoaSigaa') idPessoaSigaa: number,
    @Query('nome') nome: string,
  ): Promise<UsuarioDto> {
    return await this.usuarioService.consultaCadastroUsuario(
      Number(idPessoaSigaa),
      nome,
    );
  }

  @Patch('/mudar-permissao/:idUsuario')
  async permissaoAdm(
    @Param('idUsuario') idUsuario: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.usuarioService.permissaoAdm(
      idUsuario,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idUsuario')
  async update(
    @Param() params: UsersRouteParameters,
    @Body() users: UsuarioDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.usuarioService.update(
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
    return this.usuarioService.remove(
      idUsuario,
      currentUserId,
      currentUserName,
    );
  }
}
