import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from '../db/entities/log.entity';
import { LogDto } from './log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async logChange(data: LogDto): Promise<LogEntity> {
    const log = this.logRepository.create({
      nomeTabela: data.nomeTabela,
      idRegistro: data.idRegistro,
      operacao: data.operacao,
      dadosAntigos: data.dadosAntigos || null,
      dadosNovos: data.dadosNovos || null,
      idUsuario: data.idUsuario || null,
      usuario: data.usuario || null,
    });

    return this.logRepository.save(log);
  }
}