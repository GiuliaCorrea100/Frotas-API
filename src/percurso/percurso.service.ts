import { Injectable } from '@nestjs/common';
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