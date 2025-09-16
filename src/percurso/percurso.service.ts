import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PercursoEntity } from '../db/entities/percurso.entity';
import { Repository, IsNull, Not } from 'typeorm';
import { PercursoDto } from './percurso.dto';

@Injectable()
export class PercursoService {
  constructor(
    @InjectRepository(PercursoEntity)
    private readonly percursoRepository: Repository<PercursoEntity>,
  ) {}

  async create(percurso: PercursoDto): Promise<PercursoDto> {
    const percursoToSave = {
      ...percurso,
      saidaHora: new Date(),
      localDestino: percurso.localDestino.toUpperCase(),
      saidaOdometro: percurso.saidaOdometro,
      localOrigem: percurso.localOrigem || 'Não informado',
    };

    const created = await this.percursoRepository.save(percursoToSave);
    return this.mapEntityToDto(created);
  }
  async inserirPercursoCompleto(
    idCorrida: number,
    percurso: PercursoDto,
  ): Promise<PercursoDto> {
    const entity = new PercursoEntity();
    entity.idCorrida = idCorrida;
    entity.localOrigem = percurso.localOrigem;
    entity.localDestino = percurso.localDestino;
    entity.saidaHora = percurso.saidaHora;
    entity.chegadaHora = percurso.chegadaHora;
    entity.saidaOdometro = percurso.saidaOdometro;
    entity.chegadaodometro = percurso.chegadaodometro;

    return await this.percursoRepository.save(entity);
  }

  async finalizarPercurso(
    idPercurso: number,
    chegadaOdometro: number,
  ): Promise<PercursoDto> {
    const percurso = await this.percursoRepository.findOne({
      where: { idPercurso },
    });

    if (!percurso) {
      throw new NotFoundException('Percurso não encontrado');
    }

    if (percurso.chegadaHora) {
      throw new Error('Este percurso já foi finalizado');
    }

    if (chegadaOdometro <= percurso.saidaOdometro) {
      throw new Error(
        'Odômetro de chegada deve ser maior que o odômetro de saída',
      );
    }

    percurso.chegadaHora = new Date();
    percurso.chegadaodometro = chegadaOdometro;

    const updated = await this.percursoRepository.save(percurso);
    return this.mapEntityToDto(updated);
  }

  async findByCorrida(idCorrida: number): Promise<PercursoDto[]> {
    const percursos = await this.percursoRepository.find({
      where: { idCorrida },
      order: { saidaHora: 'DESC' },
    });

    if (!percursos || percursos.length === 0) {
      throw new NotFoundException(
        'Nenhum percurso encontrado para esta corrida',
      );
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return percursos.map(this.mapEntityToDto);
  }

  async findUltimoPercursoAtivo(
    idCorrida: number,
  ): Promise<PercursoDto | null> {
    const percurso = await this.percursoRepository.findOne({
      where: {
        idCorrida,
        chegadaHora: IsNull(),
      },
      order: { saidaHora: 'DESC' },
    });

    return percurso ? this.mapEntityToDto(percurso) : null;
  }

  async findUltimoPercursoFinalizado(
    idCorrida: number,
  ): Promise<PercursoDto | null> {
    const percurso = await this.percursoRepository.findOne({
      where: {
        idCorrida,
        chegadaHora: Not(IsNull()),
      },
      order: { chegadaHora: 'DESC' },
    });

    return percurso ? this.mapEntityToDto(percurso) : null;
  }

  async verificarPercursosAtivos(idCorrida: number): Promise<number> {
    return await this.percursoRepository.count({
      where: {
        idCorrida,
        chegadaHora: IsNull(),
      },
    });
  }

  async updatePercurso(id: number, percurso: PercursoDto) {
    const foundPercurso = await this.percursoRepository.findOne({
      where: { idPercurso: id },
    });

    if (!foundPercurso) {
      throw new HttpException(
        `Item with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    foundPercurso.chegadaHora = percurso.chegadaHora;
    foundPercurso.chegadaodometro = percurso.chegadaodometro;
    foundPercurso.localDestino = percurso.localDestino;
    foundPercurso.localOrigem = percurso.localOrigem;
    foundPercurso.saidaHora = percurso.saidaHora;
    foundPercurso.saidaOdometro = percurso.saidaOdometro;

    return await this.percursoRepository.save(foundPercurso);
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
