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
import { ocorrenciaService } from './ocorrencia.service';
import { FindAllParameters, ocorrenciaDto } from './ocorrencia.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ocorrencia')
export class ocorrenciaController {
  constructor(private readonly ocorrenciaService: ocorrenciaService) {}

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<ocorrenciaDto[]> {
    return await this.ocorrenciaService.findAll(params);
  }

  @Get('buscar-por-id/:idOcorrencia')
  async findById(
    @Param('idOcorrencia') idOcorrencia: number,
  ): Promise<ocorrenciaDto> {
    return this.ocorrenciaService.findById(idOcorrencia);
  }

  @Get('buscar-por-corrida/:idCorrida')
  async findByIdCorrida(
    @Param('idCorrida') idCorrida: number,
  ): Promise<ocorrenciaDto[]> {
    return this.ocorrenciaService.findByIdCorrida(idCorrida);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() ocorrencia: ocorrenciaDto,
    @Request() req: any,
  ): Promise<ocorrenciaDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.ocorrenciaService.create(
      ocorrencia,

      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idOcorrencia')
  @UseGuards(AuthGuard)
  async update(
    @Param('idOcorrencia') idOcorrencia: number,
    @Body() ocorrencia: ocorrenciaDto,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.ocorrenciaService.update(
      idOcorrencia,
      ocorrencia,
      currentUserId,
      currentUserName,
    );
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
    return this.ocorrenciaService.updateDescricao(
      id,
      descricao,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idOcorrencia')
  @UseGuards(AuthGuard)
  remove(@Param('idOcorrencia') idOcorrencia: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.ocorrenciaService.remove(
      idOcorrencia,
      currentUserId,
      currentUserName,
    );
  }
}
