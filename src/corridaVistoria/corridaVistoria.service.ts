import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorridaVistoriaEntity } from '../db/entities/corridaVistoria.entity';
import { CreateCorridaVistoriaDto } from './corridaVistoria.dto';
import { CorridaEntity } from '../db/entities/corrida.entity';

@Injectable()
export class CorridaVistoriaService {
  constructor(
    @InjectRepository(CorridaVistoriaEntity)
    private readonly vistoriaRepository: Repository<CorridaVistoriaEntity>,
    
    @InjectRepository(CorridaEntity)
    private readonly corridaRepository: Repository<CorridaEntity>,
  ) {}

  async registrarVistoria(dto: CreateCorridaVistoriaDto, idUsuarioLogado: number): Promise<CorridaVistoriaEntity> {
    const corrida = await this.corridaRepository.findOne({ where: { idCorrida: dto.idCorrida } });
    if (!corrida) {
      throw new NotFoundException(`Corrida com ID ${dto.idCorrida} não encontrada.`);
    }

    const vistoriaExistente = await this.vistoriaRepository.findOne({
      where: { idCorrida: dto.idCorrida, tipo: dto.tipo }
    });
    if (vistoriaExistente) {
      throw new BadRequestException(`Já existe uma vistoria de ${dto.tipo} registrada para esta corrida.`);
    }

    const novaVistoria = this.vistoriaRepository.create({
      ...dto,
      registradoPor: idUsuarioLogado,
    });

    return await this.vistoriaRepository.save(novaVistoria);
  }

  async buscarPorCorrida(idCorrida: number): Promise<CorridaVistoriaEntity[]> {
    return await this.vistoriaRepository.find({
      where: { idCorrida },
      order: { dataRegistro: 'ASC' },
    });
  }

  async verificarVistoriaPendente(
    idCorrida: number,
  ): Promise<{ pendente: boolean }> {
    const vistoria = await this.vistoriaRepository.findOne({
      where: {
        idCorrida: Number(idCorrida),
        tipo: 'ENTRADA',
      },
    });

    return {
      pendente: !Boolean(vistoria),
    };
  }
}