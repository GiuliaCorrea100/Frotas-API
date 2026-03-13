// anexo.service.ts
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
    // Garantir que a pasta base uploads existe
    if (!existsSync(this.baseUploadPath)) {
      mkdirSync(this.baseUploadPath, { recursive: true });
    }
    
    // Garantir que a pasta multas existe
    const multasPath = join(this.baseUploadPath, 'multas');
    if (!existsSync(multasPath)) {
      mkdirSync(multasPath, { recursive: true });
    }
    
    // Garantir que a pasta boletos existe
    const boletosPath = join(this.baseUploadPath, 'boletos');
    if (!existsSync(boletosPath)) {
      mkdirSync(boletosPath, { recursive: true });
    }
    
    // Garantir que a pasta comprovantes existe
    const comprovantesPath = join(this.baseUploadPath, 'comprovantes');
    if (!existsSync(comprovantesPath)) {
      mkdirSync(comprovantesPath, { recursive: true });
    }

    console.log('✅ Pastas de upload verificadas/criadas:');
    console.log(`   - ${multasPath}`);
    console.log(`   - ${boletosPath}`);
    console.log(`   - ${comprovantesPath}`);
  }

  async salvarArquivo(file: Express.Multer.File, subPasta: string = 'multas'): Promise<string> {
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
      // Criar o caminho completo para a subpasta
      const uploadPath = join(this.baseUploadPath, subPasta);
      
      // Garantir que a subpasta existe
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
        console.log(`📁 Pasta criada: ${uploadPath}`);
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomString}${fileExtension}`;
      const filePath = join(uploadPath, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      // Retornar o caminho relativo para salvar no banco
      const finalPath = `uploads/${subPasta}/${fileName}`;
      
      console.log(`✅ Arquivo salvo: ${finalPath}`);

      return finalPath;
    } catch (error) {
      console.error('❌ Erro ao salvar arquivo:', error);
      throw new BadRequestException('Erro ao salvar arquivo: ' + getErrorMessage(error));
    }
  }

  async getArquivo(fileName: string, subPasta?: string): Promise<string> {
    // Se não soubermos a subpasta, precisamos procurar
    if (!subPasta) {
      // Tenta encontrar o arquivo nas possíveis subpastas
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
    // Tenta encontrar e deletar o arquivo em qualquer subpasta
    const possiveisPastas = ['multas', 'boletos', 'comprovantes'];
    
    for (const pasta of possiveisPastas) {
      const filePath = join(this.baseUploadPath, pasta, fileName);
      if (existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          console.log(`✅ Arquivo deletado: ${filePath}`);
          return;
        } catch (error) {
          throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
        }
      }
    }
    
    // Se não encontrou em nenhuma pasta, não faz nada
  }

  async deletarArquivoPorUrl(urlArquivo: string): Promise<void> {
    if (!urlArquivo) {
      return;
    }

    // Extrair o nome do arquivo da URL (formato: uploads/subpasta/arquivo.ext)
    const parts = urlArquivo.split('/');
    const fileName = parts.pop();
    const subPasta = parts.length > 0 ? parts[parts.length - 1] : undefined;

    if (!fileName) {
      throw new BadRequestException('Nome do arquivo inválido');
    }

    // Se temos a subpasta na URL, usamos ela
    if (subPasta && (subPasta === 'multas' || subPasta === 'boletos' || subPasta === 'comprovantes')) {
      const filePath = join(this.baseUploadPath, subPasta, fileName);
      try {
        if (existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log(`✅ Arquivo deletado por URL: ${filePath}`);
        }
      } catch (error) {
        throw new BadRequestException('Erro ao deletar arquivo: ' + getErrorMessage(error));
      }
    } else {
      // Se não conseguir extrair a subpasta, procura em todas
      await this.deletarArquivo(fileName);
    }
  }
}