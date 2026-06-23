import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CorridaVistoriaDto,
  CorridaVistoriaFotoDto,
} from './corridaVistoria.dto';
import { CorridaEntity } from '../db/entities/corrida.entity';
import { CorridaVistoriaEntity } from 'src/db/entities/corridaVistoria.entity';
import { CorridaVistoriaFotoEntity } from 'src/db/entities/corridaVistoriaFoto.entity';

@Injectable()
export class CorridaVistoriaService {
  constructor(
    @InjectRepository(CorridaVistoriaEntity)
    private readonly vistoriaRepository: Repository<CorridaVistoriaEntity>,

    @InjectRepository(CorridaEntity)
    private readonly corridaRepository: Repository<CorridaEntity>,

    @InjectRepository(CorridaVistoriaFotoEntity)
    private readonly fotoRepository: Repository<CorridaVistoriaFotoEntity>,
  ) {}

  async registrarVistoria(
    vistoria: CorridaVistoriaDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<CorridaVistoriaEntity> {
    const corrida = await this.corridaRepository.findOne({
      where: { idCorrida: vistoria.idCorrida },
    });
    if (!corrida) {
      throw new NotFoundException(
        `Corrida com ID ${vistoria.idCorrida} não encontrada.`,
      );
    }

    const vistoriaExistente = await this.vistoriaRepository.findOne({
      where: { idCorrida: vistoria.idCorrida, tipo: vistoria.tipo },
    });
    if (vistoriaExistente) {
      throw new BadRequestException(
        `Já existe uma vistoria de ${vistoria.tipo} registrada para esta corrida.`,
      );
    }

    const novaVistoria = this.vistoriaRepository.create({
      ...vistoria,
      registradoPor: currentUserId,
    });

    return await this.vistoriaRepository.save(novaVistoria);
  }

  // async salvarFotos(
  //   idCorridaVistoria: number,
  //   files: Express.Multer.File[],
  // ): Promise<CorridaVistoriaFotoEntity[]> {
  //   const vistoria = await this.vistoriaRepository.findOne({
  //     where: { idCorridaVistoria },
  //   });
  //   if (!vistoria) {
  //     throw new NotFoundException(
  //       `Vistoria com ID ${idCorridaVistoria} não encontrada.`,
  //     );
  //   }

  //   const fotosSalvas: CorridaVistoriaFotoEntity[] = [];

  //   for (const file of files) {
  //     const novaFoto = this.fotoRepository.create({
  //       idCorridaVistoria,
  //       urlArquivo: file.path,
  //       dataUpload: new Date(),
  //     });
  //     const fotoSalva = await this.fotoRepository.save(novaFoto);
  //     fotosSalvas.push(fotoSalva);
  //   }

  //   return fotosSalvas;
  // }

  async buscarPorCorrida(idCorrida: number): Promise<CorridaVistoriaEntity[]> {
    return await this.vistoriaRepository.find({
      where: { idCorrida },
      order: { dataRegistro: 'ASC' },
      relations: ['usuarioRegistrou'],
    });
  }

  async verificarVistoriaPendente(
    idCorrida: number,
  ): Promise<{ pendente: boolean }> {
    const vistoria = await this.vistoriaRepository.findOne({
      where: {
        idCorrida: Number(idCorrida),
        tipo: 'RETIRADA',
      },
    });

    return {
      pendente: !vistoria,
    };
  }

  async buscarFotosVistoria(
    idCorridaVistoria: number,
  ): Promise<CorridaVistoriaFotoDto[]> {
    const fotos = await this.fotoRepository.find({
      where: { idCorridaVistoria },
      order: { dataUpload: 'ASC' },
    });

    return fotos.map((entity) => this.mapFotoToDto(entity));
  }

  private mapFotoToDto(
    entity: CorridaVistoriaFotoEntity,
  ): CorridaVistoriaFotoDto {
    const nomeArquivo = entity.urlArquivo.split('/').pop() || entity.urlArquivo;

    return {
      idCorridaVistoriaFoto: entity.idCorridaVistoriaFoto,
      idCorridaVistoria: entity.idCorridaVistoria,
      urlArquivo: `/uploads/vistoria/${nomeArquivo}`,
      dataUpload: entity.dataUpload,
    };
  }
}
