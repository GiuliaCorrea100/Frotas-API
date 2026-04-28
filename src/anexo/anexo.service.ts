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

    const recursosPath = join(this.baseUploadPath, 'recursos');
    if (!existsSync(recursosPath)) {
      mkdirSync(recursosPath, { recursive: true });
    }

    console.log('Pastas de upload verificadas/criadas:');
    console.log(`   - ${multasPath}`);
    console.log(`   - ${boletosPath}`);
    console.log(`   - ${comprovantesPath}`);
    console.log(`   - ${recursosPath}`);
  }

  async salvarArquivo(
    file: Express.Multer.File,
    subPasta: string = 'multas',
    idMulta?: number,
    tipo?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const allowedExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.doc',
      '.docx',
    ];

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
      throw new BadRequestException(
        'Arquivo muito grande. Tamanho máximo: 5MB',
      );
    }

    try {
      const uploadPath = join(this.baseUploadPath, subPasta);

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      const nomeOriginal = file.originalname.replace(fileExtension, '');
      const random8 = Math.floor(10000000 + Math.random() * 90000000);

      let fileName;

      // if (idMulta) {
      //   fileName = `${idMulta}_${nomeOriginal}_${random8}${fileExtension}`;
      // } else {
      //   fileName = `${nomeOriginal}_${random8}${fileExtension}`;
      // }
      if (idMulta && tipo) {
        fileName = `${idMulta}_${tipo}_${random8}${fileExtension}`;
      } else {
        fileName = `${nomeOriginal}_${random8}${fileExtension}`;
      }

      const filePath = join(uploadPath, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      const finalPath = `uploads/${subPasta}/${fileName}`;

      return finalPath;
    } catch (error) {
      throw new BadRequestException(
        'Erro ao salvar arquivo: ' + getErrorMessage(error),
      );
    }
  }

  async getArquivo(fileName: string, subPasta?: string): Promise<string> {
    if (!subPasta) {
      const possiveisPastas = ['multas', 'boletos', 'comprovantes', 'recursos'];

      for (const pasta of possiveisPastas) {
        const filePath = join(this.baseUploadPath, pasta, fileName);
        if (existsSync(filePath)) {
          return filePath;
        }
      }

      throw new BadRequestException('Arquivo não encontrado nas pastas de upload');
    }

    const filePath = join(this.baseUploadPath, subPasta, fileName);

    if (!existsSync(filePath)) {
      throw new BadRequestException('Arquivo não encontrado na pasta especificada');
    }

    return filePath;
  }

  async deletarArquivo(fileName: string): Promise<void> {
    const possiveisPastas = ['multas', 'boletos', 'comprovantes', 'recursos'];

    for (const pasta of possiveisPastas) {
      const filePath = join(this.baseUploadPath, pasta, fileName);
      if (existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          console.log(`Arquivo deletado: ${filePath}`);
          return;
        } catch (error) {
          throw new BadRequestException(
            'Erro ao deletar arquivo: ' + getErrorMessage(error),
          );
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

    if (
      subPasta &&
      (subPasta === 'multas' ||
        subPasta === 'boletos' ||
        subPasta === 'comprovantes' ||
        subPasta === 'recursos')
    ) {
      const filePath = join(this.baseUploadPath, subPasta, fileName);
      try {
        if (existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`Arquivo deletado por URL: ${filePath}`);
        }
      } catch (error) {
        throw new BadRequestException(
          'Erro ao deletar arquivo: ' + getErrorMessage(error),
        );
      }
    } else {
      await this.deletarArquivo(fileName);
    }
  }

  // async salvarArquivos(
  //   file: Express.Multer.File,
  //   tipo: string,
  // ): Promise<string> {
  //   if (!file) {
  //     throw new BadRequestException('Nenhum arquivo foi enviado');
  //   }

  //   const allowedExtensions = [
  //     '.pdf',
  //     '.jpg',
  //     '.jpeg',
  //     '.png',
  //     '.doc',
  //     '.docx',
  //   ];
  //   const fileExtension = file.originalname
  //     .toLowerCase()
  //     .substring(file.originalname.lastIndexOf('.'));

  //   if (!allowedExtensions.includes(fileExtension)) {
  //     throw new BadRequestException(
  //       `Tipo de arquivo não permitido. Extensões permitidas: ${allowedExtensions.join(', ')}`,
  //     );
  //   }

  //   const maxSize = 5 * 1024 * 1024;
  //   if (file.size > maxSize) {
  //     throw new BadRequestException(
  //       'Arquivo muito grande. Tamanho máximo: 5MB',
  //     );
  //   }

  //   try {
  //     const tipoPath = join(this.baseUploadPath, tipo);

  //     if (!existsSync(tipoPath)) {
  //       mkdirSync(tipoPath, { recursive: true });
  //     }

  //     const timestamp = Date.now();
  //     const randomString = Math.random().toString(36).substring(2, 15);
  //     const fileName = `${tipo}_${timestamp}_${randomString}${fileExtension}`;

  //     const filePath = join(tipoPath, fileName);

  //     await fs.promises.writeFile(filePath, file.buffer);

  //     const finalPath = `uploads/${tipo}/${fileName}`;

  //     return finalPath;
  //   } catch (error) {
  //     console.error('❌ Erro ao salvar arquivo:', error);
  //     throw new BadRequestException(
  //       'Erro ao salvar arquivo: ' + getErrorMessage(error),
  //     );
  //   }
  // }

  // async deletarArquivos(fileName: string, tipo: string): Promise<void> {
  //   const tipoPath = join(this.baseUploadPath, tipo);

  //   if (!existsSync(tipoPath)) {
  //     mkdirSync(tipoPath, { recursive: true });
  //   }

  //   const filePath = join(tipoPath, fileName);

  //   try {
  //     if (existsSync(filePath)) {
  //       await fs.promises.unlink(filePath);
  //     }
  //   } catch (error) {
  //     throw new BadRequestException(
  //       'Erro ao deletar arquivo: ' + getErrorMessage(error),
  //     );
  //   }
  // }

  // async deletarArquivosPorUrl(urlArquivo: string, tipo: string): Promise<void> {
  //   if (!urlArquivo) {
  //     return;
  //   }

  //   const fileName = urlArquivo.split('/').pop();

  //   if (!fileName) {
  //     throw new BadRequestException('Nome do arquivo inválido');
  //   }

  //   return this.deletarArquivos(fileName, tipo);
  // }
}
