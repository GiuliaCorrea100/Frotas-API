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
import {
  CorridaDto,
  CorridasRouteParameters,
  FindAllParameters,
  MotoristaDashboardDto,
} from './corrida.dto';
import { CorridaService } from './corrida.service';

@Controller('corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @Post()
  async create(@Body() corrida: CorridaDto): Promise<CorridaDto> {
    return await this.corridaService.create(corrida);
  }

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

  @Patch('/emprestar-chave/:idCorrida')
  async emprestarChave(@Param('idCorrida') idCorrida: number): Promise<void> {
    await this.corridaService.emprestarChave(idCorrida);
  }

  @Patch('/salvar-edicao-adm/:idCorrida')
  async salvarEdicaoModal(
    @Param('idCorrida') idCorrida: number,
    @Body()
    dados: {
      dataInicio?: Date;
      dataTermino?: Date;
      idMotorista?: number;
      idVeiculo?: number;
    },
  ) {
    return this.corridaService.salvarEdicaoModal(idCorrida, dados);
  }
  @Patch('/:idCorrida/situacao')
  async atualizarSituacao(
    @Param('idCorrida') idCorrida: number,
    @Body() body: { situacao: string },
  ): Promise<void> {
    await this.corridaService.atualizarSituacao(idCorrida, body.situacao);
  }

  @Put('/:idCorrida')
  async update(
    @Param() params: CorridasRouteParameters,
    @Body() corrida: CorridaDto,
  ) {
    await this.corridaService.update(params.idCorrida, corrida);
  }

  @Delete('/:idCorrida')
  remove(@Param('idCorrida') idCorrida: number) {
    return this.corridaService.remove(idCorrida);
  }
}
