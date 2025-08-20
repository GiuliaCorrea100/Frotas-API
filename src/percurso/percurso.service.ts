import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PercursoEntity } from '../db/entities/percurso.entity';
import { Repository } from 'typeorm';
import { PercursoDto } from './percurso.dto';

@Injectable()
export class PercursoService {
  constructor(
    @InjectRepository(PercursoEntity)
    private readonly percursoRepository: Repository<PercursoEntity>,
  ) {}

  async create(percurso: PercursoDto): Promise<PercursoDto> {
    const existingPercurso = await this.percursoRepository.findOne({
      where: { idCorrida: percurso.idCorrida },
    });

    if (existingPercurso) {
      throw new Error('Esta corrida já foi iniciada');
    }

    const percursoToSave = {
      ...percurso,
      saidaHora: new Date(),
      localDestino: percurso.localDestino,
      saidaOdometro: percurso.saidaOdometro,
    };

    const created = await this.percursoRepository.save(percursoToSave);
    return this.mapEntityToDto(created);
  }

  async finalizarPercurso(idPercurso: number, chegadaOdometro: number): Promise<PercursoDto> {
    const percurso = await this.percursoRepository.findOne({
      where: { idPercurso }
    });

    if (!percurso) {
      throw new NotFoundException('Percurso não encontrado');
    }

    if (percurso.chegadaHora) {
      throw new Error('Este percurso já foi finalizado');
    }

    if (chegadaOdometro <= percurso.saidaOdometro) {
      throw new Error('Odômetro de chegada deve ser maior que o odômetro de saída');
    }

    percurso.chegadaHora = new Date();
    percurso.chegadaodometro = chegadaOdometro;

    const updated = await this.percursoRepository.save(percurso);
    return this.mapEntityToDto(updated);
  }

  async findByCorrida(idCorrida: number): Promise<PercursoDto> {
    const percurso = await this.percursoRepository.findOne({
      where: { idCorrida }
    });

    if (!percurso) {
      throw new NotFoundException('Percurso não encontrado para esta corrida');
    }

    return this.mapEntityToDto(percurso);
  }

  private mapEntityToDto(entity: PercursoEntity): PercursoDto {
    return {
      idPercurso: entity.idPercurso,
      idCorrida: entity.idCorrida,
      saidaHora: entity.saidaHora,
      saidaOdometro: entity.saidaOdometro,
      localDestino: entity.localDestino,
      chegadaHora: entity.chegadaHora,
      chegadaodometro: entity.chegadaodometro,
      localOrigem: entity.localOrigem,
    };
  }
}