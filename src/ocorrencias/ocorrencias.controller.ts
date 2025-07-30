import {
  Controller,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { OcorrenciasService } from './ocorrencias.service';
import { FindAllParameters, OcorrenciasDto } from './ocorrencias.dto';

@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly ocorrenciasService: OcorrenciasService) {}

  @Post()
  async create(@Body() ocorrencia: OcorrenciasDto): Promise<OcorrenciasDto> {
    return await this.ocorrenciasService.create(ocorrencia);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<OcorrenciasDto[]> {
    return await this.ocorrenciasService.findAll(params);
  }

  @Get('buscar-por-id/:idOcorrencia')
  async findById(
    @Param('idOcorrencia') idOcorrencia: number,
  ): Promise<OcorrenciasDto> {
    return this.ocorrenciasService.findById(idOcorrencia);
  }

  @Get('buscar-por-corrida/:idCorrida')
  async findByIdCorrida(
    @Param('idCorrida') idCorrida: number,
  ): Promise<OcorrenciasDto> {
    return this.ocorrenciasService.findByIdCorrida(idCorrida);
  }

  @Put('/:idOcorrencia')
  async update(
    idOcorrencia: number,
    ocorrencia: OcorrenciasDto,
  ): Promise<void> {
    await this.ocorrenciasService.update(idOcorrencia, ocorrencia);
  }

  @Delete('/:idOcorrencia')
  remove(@Param('idOcorrencia') idOcorrencia: number) {
    return this.ocorrenciasService.remove(idOcorrencia);
  }
}
