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

  //adicionei esse aq natly
  @Get('/verificar-agendada/:idMotorista')
  async verificarCorridaAgendada(@Param('idMotorista') idMotorista: number): Promise<boolean> {
    return this.corridaService.verificarCorridaAgendada(idMotorista);
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
