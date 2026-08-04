/* eslint-disable prettier/prettier */
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ocorrenciaService } from './ocorrencia.service';
import { FindAllParameters, ocorrenciaDto } from './ocorrencia.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { bool } from 'sharp';

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
  @UseInterceptors(FileInterceptor('arquivo'))
  async create(
    @Body() ocorrenciaDto: ocorrenciaDto,
    @UploadedFile() arquivo: Express.Multer.File,
    @Request() req: any,
  ) {

    let enviadoMotorista: boolean;
  
    if (typeof ocorrenciaDto.enviadoMotorista === 'string') {
      enviadoMotorista = ocorrenciaDto.enviadoMotorista.toLowerCase() === 'true';
    } else {
      enviadoMotorista = Boolean(ocorrenciaDto.enviadoMotorista);
    }
    return this.ocorrenciaService.create(
      {
        ...ocorrenciaDto,
        idCorrida: Number(ocorrenciaDto.idCorrida),
        idMotorista: ocorrenciaDto.idMotorista
          ? Number(ocorrenciaDto.idMotorista)
          : undefined,
        dataOcorrencia: new Date(ocorrenciaDto.dataOcorrencia),
        enviadoMotorista,
      },
      arquivo,
      req.user.sub,
      req.user.login,
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

  @Patch(':id/')
  @UseGuards(AuthGuard)
  async updateOcorrencia(
    @Param('id') id: number,
    @Body() ocorrencia: ocorrenciaDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.ocorrenciaService.updateOcorrencia(
      id,
      ocorrencia,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/deletar-ocorrencia/:idOcorrencia')
  @UseGuards(AuthGuard)
  async softRemove(
    @Param('idOcorrencia') idOcorrencia: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    console.log(idOcorrencia);

    return this.ocorrenciaService.softRemove(
      idOcorrencia,
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
