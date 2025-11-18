import { Injectable, NotFoundException } from '@nestjs/common';
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
    const entity = new PercursoEntity();
    entity.idCorrida = percurso.idCorrida;
    entity.localOrigem = percurso.localOrigem || 'Não informado';
    entity.localDestino = percurso.localDestino.toUpperCase();
    entity.saidaHora = new Date();
    entity.saidaOdometro = percurso.saidaOdometro;
    //entity.chegadaHora = new Date();
    //entity.chegadaOdometro = percurso.chegadaOdometro;

    const savedPercurso = await this.percursoRepository.save(entity);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: savedPercurso.idPercurso,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedPercurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(savedPercurso);
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

    const savedPercurso = await this.percursoRepository.save(entity);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: savedPercurso.idPercurso,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedPercurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(savedPercurso);
  }

  async finalizarPercurso(
    idPercurso: number,
    chegadaOdometro: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<PercursoDto> {
    const foundPercurso = await this.percursoRepository.findOne({
      where: { idPercurso },
    });

    if (!foundPercurso) {
      throw new NotFoundException(`Item with id ${idPercurso} not found`);
    }

    if (foundPercurso.chegadaHora) {
      throw new Error('Este percurso já foi finalizado');
    }

    if (chegadaOdometro <= foundPercurso.saidaOdometro) {
      throw new Error(
        'Odômetro de chegada deve ser maior que o odômetro de saída',
      );
    }

    const dadosAntigos = { ...foundPercurso };

    foundPercurso.chegadaHora = new Date();
    foundPercurso.chegadaOdometro = chegadaOdometro;

    const updatedPercurso = await this.percursoRepository.save(foundPercurso);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: idPercurso,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedPercurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(updatedPercurso);
  }

  async findByCorrida(idCorrida: number): Promise<PercursoDto[]> {
    const percursos = await this.percursoRepository.find({
      where: { idCorrida },
      order: { saidaHora: 'DESC' },
    });

    if (!percursos || percursos.length === 0) {
      return [];
    }

    return percursos.map((percurso) => this.mapEntityToDto(percurso));
  }

  async findUltimoPercursoAtivo(
    idCorrida: number,
  ): Promise<PercursoDto | null> {
    try {
      const percurso = await this.percursoRepository.findOne({
        where: {
          idCorrida,
          chegadaHora: IsNull(),
        },
        order: { saidaHora: 'DESC' },
      });

      if (!percurso) {
        return null;
      }

      return this.mapEntityToDto(percurso);
    } catch (error) {
      console.error('Erro em findUltimoPercursoAtivo:', error);
      throw error;
    }
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

    if (!percurso) {
      return null;
    }

    return this.mapEntityToDto(percurso);
  }

  async verificarPercursosAtivos(idCorrida: number): Promise<number> {
    return await this.percursoRepository.count({
      where: {
        idCorrida,
        chegadaHora: IsNull(),
      },
    });
  }

   async softRemove(
    idPercurso: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundPercurso = await this.percursoRepository.findOne({
      where: { idPercurso },
    });

    if (!foundPercurso) {
      throw new NotFoundException(`Item with id ${idPercurso} not found`);
    }

    const dadosAntigos = { ...foundPercurso };

    foundPercurso.ativo = false;

    const updatedPercurso = await this.percursoRepository.save(foundPercurso);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: idPercurso,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedPercurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async updatePercurso(
    id: number,
    percurso: PercursoDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundPercurso = await this.percursoRepository.findOne({
      where: { idPercurso: id },
    });

    if (!foundPercurso) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    const dadosAntigos = { ...foundPercurso };

    foundPercurso.chegadaHora = percurso.chegadaHora;
    foundPercurso.chegadaOdometro = percurso.chegadaOdometro;
    foundPercurso.localDestino = percurso.localDestino;
    foundPercurso.localOrigem = percurso.localOrigem;
    foundPercurso.saidaHora = percurso.saidaHora;
    foundPercurso.saidaOdometro = percurso.saidaOdometro;

    const updatedPercurso = await this.percursoRepository.save(foundPercurso);

    const logData: LogDto = {
      nomeTabela: 'percurso',
      idRegistro: id,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedPercurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
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
      ativo: entity.ativo,
    };
  }
}
