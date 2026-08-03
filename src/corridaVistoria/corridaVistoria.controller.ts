/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CorridaVistoriaDto } from './corridaVistoria.dto';
import { AuthGuard } from '../auth/auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('corrida-vistoria')
@UseGuards(AuthGuard)
export class CorridaVistoriaController {
  constructor(
    private readonly corridaVistoriaService: CorridaVistoriaService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async criarVistoria(
    @Body() vistoria: CorridaVistoriaDto,
    @Request() req: any,
  ): Promise<CorridaVistoriaDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.corridaVistoriaService.registrarVistoria(
      vistoria,
      currentUserId,
      currentUserName,
    );
  }

  @Get('fotos/:idCorridaVistoria')
  async buscarFotosVistoria(
    @Param('idCorridaVistoria') idCorridaVistoria: number,
  ) {
    return await this.corridaVistoriaService.buscarFotosVistoria(
      Number(idCorridaVistoria),
    );
  }

  @Get('corrida/:idCorrida')
  async buscarPorCorrida(@Param('idCorrida') idCorrida: number) {
    return await this.corridaVistoriaService.buscarPorCorrida(idCorrida);
  }

  @Get('status-pendente/:idCorrida')
  async verificarStatus(@Param('idCorrida') idCorrida: string) {
    return await this.corridaVistoriaService.verificarVistoriaPendente(
      Number(idCorrida),
    );
  }
}
