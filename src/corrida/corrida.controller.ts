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
import {
  CorridaDto,
  CorridasRouteParameters,
  FindAllParameters,
  MotoristaDashboardDto,
} from './corrida.dto';
import { CorridaService } from './corrida.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @Get('/:idCorrida')
  async findById(@Param('idCorrida') idCorrida: number): Promise<CorridaDto> {
    return this.corridaService.findById(idCorrida);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CorridaDto[]> {
    return this.corridaService.findAll(params);
  }

  @Get('/motorista-dashboard/:idMotorista')
  async getMotoristaDashboard(
    @Param('idMotorista') idMotorista: number,
  ): Promise<MotoristaDashboardDto> {
    return this.corridaService.getMotoristaDashboard(idMotorista);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() corrida: CorridaDto,
    @Request() req: any,
  ): Promise<CorridaDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.corridaService.create(
      corrida,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/emprestar-chave/:idCorrida')
  @UseGuards(AuthGuard)
  async emprestarChave(
    @Param('idCorrida') idCorrida: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.corridaService.emprestarChave(
      idCorrida,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/salvar-edicao-adm/:idCorrida')
  @UseGuards(AuthGuard)
  async salvarEdicaoModal(
    @Param('idCorrida') idCorrida: number,
    @Body()
    dados: {
      dataInicio?: Date;
      dataTermino?: Date;
      idMotorista?: number;
      idCarro?: number;
    },
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.corridaService.salvarEdicaoModal(
      idCorrida,
      dados,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/:idCorrida/situacao')
  @UseGuards(AuthGuard)
  async atualizarSituacao(
    @Param('idCorrida') idCorrida: number,
    @Body() body: { situacao: string },
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login || req.user?.nome;
    await this.corridaService.atualizarSituacao(
      idCorrida,
      body.situacao,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idCorrida')
  @UseGuards(AuthGuard)
  async update(
    @Param() params: CorridasRouteParameters,
    @Body() corrida: CorridaDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.corridaService.update(
      params.idCorrida,
      corrida,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idCorrida')
  @UseGuards(AuthGuard)
  remove(@Param('idCorrida') idCorrida: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.corridaService.remove(
      idCorrida,
      currentUserId,
      currentUserName,
    );
  }
}
