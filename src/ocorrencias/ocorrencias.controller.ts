import {
  Controller,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Get,
  Query,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OcorrenciasService } from './ocorrencias.service';
import { FindAllParameters, OcorrenciasDto } from './ocorrencias.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly ocorrenciasService: OcorrenciasService) {}

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
  ): Promise<OcorrenciasDto[]> {
    return this.ocorrenciasService.findByIdCorrida(idCorrida);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() ocorrencia: OcorrenciasDto, @Request() req: any): Promise<OcorrenciasDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.ocorrenciasService.create(ocorrencia, currentUserId, currentUserName);
  }

  @Put('/:idOcorrencia')
  @UseGuards(AuthGuard)
  async update(
    @Param('idOcorrencia') idOcorrencia: number,
    @Body() ocorrencia: OcorrenciasDto,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.ocorrenciasService.update(idOcorrencia, ocorrencia, currentUserId, currentUserName);
  }

  @Patch(':id/descricao')
  @UseGuards(AuthGuard)
  async updateDescricao(
    @Param('id') id: number,
    @Body('descricao') descricao: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.ocorrenciasService.updateDescricao(id, descricao, currentUserId, currentUserName);
  }

  @Delete('/:idOcorrencia')
  @UseGuards(AuthGuard)
  remove(@Param('idOcorrencia') idOcorrencia: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.ocorrenciasService.remove(idOcorrencia, currentUserId, currentUserName);
  }
}
