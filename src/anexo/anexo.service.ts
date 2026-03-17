import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

@Injectable()
export class AnexoService {
  private readonly uploadPath = join(process.cwd(), 'uploads', 'multas');

  private readonly baseUploadPath = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async salvarArquivo(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Extensões permitidas: ${allowedExtensions.join(', ')}`,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo muito grande. Tamanho máximo: 5MB');
    }

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `multa_${timestamp}_${randomString}${fileExtension}`;
      const filePath = join(this.uploadPath, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      const finalPath = `uploads/multas/${fileName}`;

      return finalPath;
    } catch (error) {
      console.error('❌ Erro ao salvar arquivo:', error);
      throw new BadRequestException('Erro ao salvar arquivo: ' + getErrorMessage(error));
    }
  }

  async getArquivo(fileName: string): Promise<string> {
    const filePath = join(this.uploadPath, fileName);

    if (!existsSync(filePath)) {
      throw new BadRequestException('Arquivo não encontrado');
    }

    return filePath;
  }

  async deletarArquivo(fileName: string): Promise<void> {
    const filePath = join(this.uploadPath, fileName);

    try {
      if (existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
    }
  }

    async deletarArquivoPorUrl(urlArquivo: string): Promise<void> {
    if (!urlArquivo) {
      return;
    }
    console.log(urlArquivo);
    const fileName = urlArquivo.split('/').pop();

    if (!fileName) {
      throw new BadRequestException('Nome do arquivo inválido');
    }

    return this.deletarArquivo(fileName);
  }


  // Funções que fiz pra não dar b.o com os da giulia
   async salvarArquivos(file: Express.Multer.File, tipo: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido. Extensões permitidas: ${allowedExtensions.join(', ')}`,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo muito grande. Tamanho máximo: 5MB');
    }

    try {
      const tipoPath = join(this.baseUploadPath, tipo);
      
      if (!existsSync(tipoPath)) {
        mkdirSync(tipoPath, { recursive: true });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${tipo}_${timestamp}_${randomString}${fileExtension}`;

      
      const filePath = join(tipoPath, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      const finalPath = `uploads/${tipo}/${fileName}`;

      return finalPath;
    } catch (error) {
      console.error('❌ Erro ao salvar arquivo:', error);
      throw new BadRequestException('Erro ao salvar arquivo: ' + getErrorMessage(error));
    }
  }

  async deletarArquivos(fileName: string, tipo:string): Promise<void> {
      const tipoPath = join(this.baseUploadPath, tipo);
      
      if (!existsSync(tipoPath)) {
        mkdirSync(tipoPath, { recursive: true });
      }

    const filePath = join(tipoPath, fileName);

    try {
      if (existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
    }
  }

  async deletarArquivosPorUrl(urlArquivo: string, tipo:string): Promise<void> {
    if (!urlArquivo) {
      return;
    }
    console.log(urlArquivo);
    const fileName = urlArquivo.split('/').pop();

    if (!fileName) {
      throw new BadRequestException('Nome do arquivo inválido');
    }

    return this.deletarArquivos(fileName, tipo);
  }
}