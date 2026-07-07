import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Body,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AnexoService } from './anexo.service';
import { Response } from 'express';
import * as path from 'path';
import * as _sharp from 'sharp';
const sharp = (_sharp as any).default || _sharp; //Fallback de importação do sharp

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

@Controller('anexo')
export class AnexoController {
  constructor(private readonly anexoService: AnexoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('arquivo'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Nenhum arquivo foi enviado');
      }

      const filePath = await this.anexoService.salvarArquivo(file);

      return {
        message: 'Arquivo salvo com sucesso',
        fileName: path.basename(filePath),
        filePath,
        originalName: file.originalname,
        size: file.size,
      };
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Post('upload/:idCorridaVistoria')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('idCorridaVistoria') idCorridaVistoria: number,
    @Query('tipo') tipo: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    const anexos = files.map(() => ({
      idCorridaVistoria: Number(idCorridaVistoria),
      tipo,
    }));
    return await this.anexoService.createMultiple(anexos, files);
  }

  @Get('converter-png')
  async converterParaPng(
    @Query('path') imagePath: string,
  ): Promise<{ url: string }> {
    try {
      if (!imagePath) {
        throw new BadRequestException('Parâmetro path é obrigatório');
      }
      const relativePath = imagePath.replace(/^\//, '');
      const fullPath = path.resolve(process.cwd(), relativePath);
      const pngBuffer = await sharp(fullPath).png().toBuffer();
      const base64 = pngBuffer.toString('base64');
      return { url: `data:image/png;base64,${base64}` };
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.anexoService.getArquivo(fileName);
      return res.download(filePath);
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Delete('remover-por-url')
  async deleteFileByUrl(@Body() body: { urlArquivo: string }) {
    try {
      if (!body.urlArquivo) {
        throw new BadRequestException('URL do arquivo não fornecida');
      }

      await this.anexoService.deletarArquivoPorUrl(body.urlArquivo);
      return { message: 'Arquivo deletado com sucesso' };
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    try {
      await this.anexoService.deletarArquivo(fileName);
      return { message: 'Arquivo deletado com sucesso' };
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }
}
