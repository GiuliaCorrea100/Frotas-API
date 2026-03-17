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
  private readonly baseUploadPath = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.baseUploadPath)) {
      mkdirSync(this.baseUploadPath, { recursive: true });
    }
    
    const multasPath = join(this.baseUploadPath, 'multas');
    if (!existsSync(multasPath)) {
      mkdirSync(multasPath, { recursive: true });
    }
    
    const boletosPath = join(this.baseUploadPath, 'boletos');
    if (!existsSync(boletosPath)) {
      mkdirSync(boletosPath, { recursive: true });
    }
    
    const comprovantesPath = join(this.baseUploadPath, 'comprovantes');
    if (!existsSync(comprovantesPath)) {
      mkdirSync(comprovantesPath, { recursive: true });
    }

    console.log('Pastas de upload verificadas/criadas:');
    console.log(`   - ${multasPath}`);
    console.log(`   - ${boletosPath}`);
    console.log(`   - ${comprovantesPath}`);
  }

  async salvarArquivo(
    file: Express.Multer.File,
    subPasta: string = 'multas',
    idMulta?: number,
  ): Promise<string> {
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
      const uploadPath = join(this.baseUploadPath, subPasta);

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      const nomeOriginal = file.originalname.replace(fileExtension, '');
      const random8 = Math.floor(10000000 + Math.random() * 90000000);

      let fileName;

      if (idMulta) {
        fileName = `${idMulta}_${nomeOriginal}_${random8}${fileExtension}`;
      } else {
        fileName = `${nomeOriginal}_${random8}${fileExtension}`;
      }

      const filePath = join(uploadPath, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      const finalPath = `uploads/${subPasta}/${fileName}`;

      return finalPath;
    } catch (error) {
      throw new BadRequestException('Erro ao salvar arquivo: ' + getErrorMessage(error));
    }
  }

  async getArquivo(fileName: string, subPasta?: string): Promise<string> {
    if (!subPasta) {
      const possiveisPastas = ['multas', 'boletos', 'comprovantes'];
      
      for (const pasta of possiveisPastas) {
        const filePath = join(this.baseUploadPath, pasta, fileName);
        if (existsSync(filePath)) {
          return filePath;
        }
      }
      
      throw new BadRequestException('Arquivo não encontrado');
    }

    const filePath = join(this.baseUploadPath, subPasta, fileName);

    if (!existsSync(filePath)) {
      throw new BadRequestException('Arquivo não encontrado');
    }

    return filePath;
  }

  async deletarArquivo(fileName: string): Promise<void> {
    const possiveisPastas = ['multas', 'boletos', 'comprovantes'];
    
    for (const pasta of possiveisPastas) {
      const filePath = join(this.baseUploadPath, pasta, fileName);
      if (existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          console.log(`Arquivo deletado: ${filePath}`);
          return;
        } catch (error) {
          throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
        }
      }
    }
    
  }

  async deletarArquivoPorUrl(urlArquivo: string): Promise<void> {
    if (!urlArquivo) {
      return;
    }

    const parts = urlArquivo.split('/');
    const fileName = parts.pop();
    const subPasta = parts.length > 0 ? parts[parts.length - 1] : undefined;

    if (!fileName) {
      throw new BadRequestException('Nome do arquivo inválido');
    }

    if (subPasta && (subPasta === 'multas' || subPasta === 'boletos' || subPasta === 'comprovantes')) {
      const filePath = join(this.baseUploadPath, subPasta, fileName);
      try {
        if (existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`Arquivo deletado por URL: ${filePath}`);
        }
      } catch (error) {
        throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
      }
    } else {
      await this.deletarArquivo(fileName);
    }
  }
}