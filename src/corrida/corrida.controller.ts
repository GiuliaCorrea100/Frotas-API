import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
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

  // ❌ REMOVIDO: O endpoint antigo que causava o erro foi removido.
  // @Get('/verificar-agendada/:idMotorista')
  // async verificarCorridaAgendada(...) {}

  // ✅ MANTIDO: Este é o novo endpoint que o front-end está usando.
  @Get('/motorista-dashboard/:idMotorista')
  async getMotoristaDashboard(
    @Param('idMotorista') idMotorista: number,
  ): Promise<MotoristaDashboardDto> {
    return this.corridaService.getMotoristaDashboard(idMotorista);
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
