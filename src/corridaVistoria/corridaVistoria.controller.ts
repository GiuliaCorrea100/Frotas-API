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

  // @Post(':id/fotos/:tipo')
  // @UseInterceptors(
  //   FilesInterceptor('files', 10, {
  //     storage: diskStorage({
  //       destination: './uploads/vistoria',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const ext = extname(file.originalname);
  //         const tipoUrl = req.params.tipo;
  //         const prefixo = tipoUrl === 'retirada' ? 'retirada' : 'vistoria';
  //         callback(null, `${prefixo}-${uniqueSuffix}${ext}`);
  //       },
  //     }),
  //     fileFilter: (req, file, callback) => {
  //       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //         return callback(
  //           new Error('Apenas imagens JPG, JPEG e PNG são permitidas!'),
  //           false,
  //         );
  //       }
  //       callback(null, true);
  //     },
  //   }),
  // )
  // async enviarFotos(
  //   @Param('id', ParseIntPipe) idCorridaVistoria: number,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   return await this.corridaVistoriaService.salvarFotos(
  //     idCorridaVistoria,
  //     files,
  //   );
  // }

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
