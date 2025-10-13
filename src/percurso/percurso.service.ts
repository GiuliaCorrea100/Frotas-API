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
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class PercursoService {
  constructor(
    @InjectRepository(PercursoEntity)
    private readonly percursoRepository: Repository<PercursoEntity>,
    private readonly logService: LogService,
  ) {}

  async create(
    percurso: PercursoDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<PercursoDto> {
    const percursoToSave = {
      ...percurso,
      saidaHora: new Date(),
      localDestino: percurso.localDestino.toUpperCase(),
      saidaOdometro: percurso.saidaOdometro,
      localOrigem: percurso.localOrigem || 'Não informado',
    };

    const created = await this.percursoRepository.save(percursoToSave);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: created.idPercurso,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: created,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };
    await this.logService.logChange(logData);

    return this.mapEntityToDto(created);
  }

  async inserirPercursoCompleto(
    idCorrida: number,
    percurso: PercursoDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<PercursoDto> {
    const entity = new PercursoEntity();
    entity.idCorrida = idCorrida;
    entity.localOrigem = percurso.localOrigem;
    entity.localDestino = percurso.localDestino;
    entity.saidaHora = percurso.saidaHora;
    entity.chegadaHora = percurso.chegadaHora;
    entity.saidaOdometro = percurso.saidaOdometro;
    entity.chegadaOdometro = percurso.chegadaOdometro;

    const created = await this.percursoRepository.save(entity);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: created.idPercurso,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: created,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };
    await this.logService.logChange(logData);

    return created;
  }

  async finalizarPercurso(
    idPercurso: number,
    chegadaOdometro: number,
    currentUserId?: number,
    currentUserName?: string,
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

    const dadosAntigos = { ...percurso };

    percurso.chegadaHora = new Date();
    percurso.chegadaOdometro = chegadaOdometro;

    const updated = await this.percursoRepository.save(percurso);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: idPercurso,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updated,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };
    await this.logService.logChange(logData);

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

  async updatePercurso(
    id: number,
    percurso: PercursoDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundPercurso = await this.percursoRepository.findOne({
      where: { idPercurso: id },
    });

    if (!foundPercurso) {
      throw new HttpException(
        `Item with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundPercurso };

    foundPercurso.chegadaHora = percurso.chegadaHora;
    foundPercurso.chegadaOdometro = percurso.chegadaOdometro;
    foundPercurso.localDestino = percurso.localDestino;
    foundPercurso.localOrigem = percurso.localOrigem;
    foundPercurso.saidaHora = percurso.saidaHora;
    foundPercurso.saidaOdometro = percurso.saidaOdometro;

    const updated = await this.percursoRepository.save(foundPercurso);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: id,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updated,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };
    await this.logService.logChange(logData);

    return updated;
  }

  private mapEntityToDto(entity: PercursoEntity): PercursoDto {
    return {
      idPercurso: entity.idPercurso,
      idCorrida: entity.idCorrida,
      saidaHora: entity.saidaHora,
      saidaOdometro: entity.saidaOdometro,
      localDestino: entity.localDestino,
      chegadaHora: entity.chegadaHora,
      chegadaOdometro: entity.chegadaOdometro,
      localOrigem: entity.localOrigem,
    };
  }
}
