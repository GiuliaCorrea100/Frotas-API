import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CorridaDto,
  FindAllParameters,
  MotoristaDashboardDto,
} from './corrida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CorridaEntity } from 'src/db/entities/corrida.entity';
import {
  FindOptionsWhere,
  Repository,
  Between,
  MoreThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  In,
  Like,
} from 'typeorm';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridaEntity)
    private readonly corridaRepository: Repository<CorridaEntity>,
    private readonly logService: LogService,
  ) {}

  async verificarConflitoDeCorrida(
    idMotorista: number,
    dataInicio: Date,
    dataTermino: Date,
  ): Promise<boolean> {
    const conflitos = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'AGENDADA',
        dataInicio: LessThanOrEqual(dataTermino),
        dataTermino: MoreThanOrEqual(dataInicio),
      },
    });

    return conflitos.length > 0;
  }

  async verificarConflitoDeCarro(
    idCarro: number,
    dataInicio: Date,
    dataTermino: Date,
  ): Promise<boolean> {
    const conflitos = await this.corridaRepository.find({
      where: {
        idCarro,
        situacao: In(['AGENDADA', 'ANDAMENTO']),
        dataInicio: LessThanOrEqual(dataTermino),
        dataTermino: MoreThanOrEqual(dataInicio),
      },
    });

    return conflitos.length > 0;
  }

  async create(
    corrida: CorridaDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<CorridaDto> {
    // Ajustar Hora do dataTermino
    if (corrida.dataTermino) {
      const dataTermino = new Date(corrida.dataTermino);
      const dataTerminoUTC = new Date(
        Date.UTC(
          dataTermino.getUTCFullYear(),
          dataTermino.getUTCMonth(),
          dataTermino.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      );
      corrida.dataTermino = dataTerminoUTC;
    }
    corrida.localDeSaida = corrida.localDeSaida.toUpperCase();
    const conflitoMotorista = await this.verificarConflitoDeCorrida(
      corrida.idMotorista,
      new Date(corrida.dataInicio),
      new Date(corrida.dataTermino),
    );

    if (conflitoMotorista) {
      throw new HttpException(
        'Já existe uma corrida agendada para esse usuário nesse período!',
        HttpStatus.CONFLICT,
      );
    }

    const conflitoCarro = await this.verificarConflitoDeCarro(
      corrida.idCarro,
      new Date(corrida.dataInicio),
      new Date(corrida.dataTermino),
    );

    if (conflitoCarro) {
      throw new HttpException(
        'O carro já está agendado para outra corrida nesse período!',
        HttpStatus.CONFLICT,
      );
    }

    const corridaToSave = this.mapDtoToEntity(corrida);
    corridaToSave.situacao = 'AGENDADA';

    const insertResult = await this.corridaRepository.insert(corridaToSave);
    const identifiers = insertResult.identifiers as { idCorrida: number }[];
    const newId = identifiers[0].idCorrida;

    if (!newId) {
      throw new Error('Falha ao criar a corrida, o ID não foi gerado.');
    }

    await this.corridaRepository.save(corridaToSave);

    const savedCorrida = await this.findById(newId);

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: newId,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedCorrida,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedCorrida;
  }

  async findById(idCorrida: number): Promise<CorridaDto> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
      relations: ['motorista', 'carro'],
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }
    return this.mapEntityToDto(foundCorrida);
  }

  async findAll(params: FindAllParameters): Promise<CorridaDto[]> {
    const searchParams: FindOptionsWhere<CorridaEntity> = {};

    if (params.localDeSaida) {
      searchParams.localDeSaida = Like(`%${params.localDeSaida}%`);
    }

    const corridaFound = await this.corridaRepository.find({
      where: searchParams,
      relations: ['motorista', 'carro'],
      order: {
        dataInicio: 'DESC',
      },
    });

    return corridaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async emprestarChave(
    idCorrida: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const dadosAntigos = { ...foundCorrida };

    if (foundCorrida.chaveEmprestada == false) {
      foundCorrida.chaveEmprestada = true;
      foundCorrida.dataHoraLiberacaoChave = new Date();
    } else {
      foundCorrida.chaveEmprestada = false;
      foundCorrida.dataHoraRecebimentoChave = new Date();
    }

    await this.corridaRepository.save(foundCorrida);

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: idCorrida,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: foundCorrida,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async atualizarSituacao(
    idCorrida: number,
    situacao: string,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const transicoesPermitidas = {
      AGENDADA: ['ANDAMENTO', 'CANCELADA'],
      ANDAMENTO: ['FINALIZADA'],
      FINALIZADA: [],
      CANCELADA: [],
    };

    const situacaoAtual = foundCorrida.situacao;

    if (!transicoesPermitidas[situacaoAtual]?.includes(situacao)) {
      throw new HttpException(
        `Transição de situação de ${situacaoAtual} para ${situacao} não é permitida`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundCorrida };

    foundCorrida.situacao = situacao;
    await this.corridaRepository.save(foundCorrida);

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: idCorrida,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: foundCorrida,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async salvarEdicaoModal(
    idCorrida: number,
    dados: {
      dataInicio?: Date;
      dataTermino?: Date;
      idMotorista?: number;
      idCarro?: number;
    },
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const corrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!corrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const dadosAntigos = { ...corrida };

    // Ajustar Hora do dataTermino
    let dataTerminoAjustada = dados.dataTermino ?? corrida.dataTermino;
    if (dados.dataTermino) {
      const dataTermino = new Date(dados.dataTermino);
      dataTerminoAjustada = new Date(
        Date.UTC(
          dataTermino.getUTCFullYear(),
          dataTermino.getUTCMonth(),
          dataTermino.getUTCDate(),
          23,
          59,
          59,
          999,
        ),
      );
    }

    await this.corridaRepository.update(idCorrida, {
      dataInicio: dados.dataInicio ?? corrida.dataInicio,
      dataTermino: dataTerminoAjustada,
      idMotorista: dados.idMotorista ?? corrida.idMotorista,
      idCarro: dados.idCarro ?? corrida.idCarro,
    });

    const updatedCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: idCorrida,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedCorrida,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return { message: 'Edição salva com sucesso' };
  }

  async update(
    idCorrida: number,
    corrida: CorridaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    corrida.localDeSaida = corrida.localDeSaida.toUpperCase();

    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const dadosAntigos = { ...foundCorrida };

    await this.corridaRepository.update(
      idCorrida,
      this.mapDtoToEntity(corrida),
    );

    const updatedCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: idCorrida,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedCorrida,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idCorrida: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const corridaToDelete = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!corridaToDelete) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const dadosAntigos = { ...corridaToDelete };

    const result = await this.corridaRepository.delete(idCorrida);

    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'corridas',
      idRegistro: idCorrida,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async getMotoristaDashboard(
    idMotorista: number,
  ): Promise<MotoristaDashboardDto> {
    const hoje = new Date();
    hoje.setUTCHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    amanha.setUTCHours(23, 59, 59, 999);

    const corridasAgendadasHoje = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'AGENDADA',
        dataInicio: LessThanOrEqual(amanha),
        dataTermino: MoreThanOrEqual(hoje),
      },
      order: {
        dataInicio: 'ASC',
      },
      relations: ['carro'],
    });

    const corridasEmAndamento = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'ANDAMENTO',
      },
      relations: ['carro'],
    });

    const corridasFinalizadasHoje = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'FINALIZADA',
        dataInicio: Between(hoje, amanha),
      },
      order: {
        dataInicio: 'DESC',
      },
      relations: ['carro'],
    });

    const proximasCorridas = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'AGENDADA',
        dataInicio: MoreThan(amanha),
      },
      order: {
        dataInicio: 'ASC',
      },
      relations: ['carro'],
    });

    const corridaAtiva =
      corridasEmAndamento.length > 0
        ? corridasEmAndamento[0]
        : corridasAgendadasHoje.length > 0
          ? corridasAgendadasHoje[0]
          : corridasFinalizadasHoje.length > 0
            ? corridasFinalizadasHoje[0]
            : null;

    return {
      corridaDeHoje: corridaAtiva ? this.mapEntityToDto(corridaAtiva) : null,
      proximasCorridas: [
        ...corridasAgendadasHoje
          .slice(1)
          .map((entity) => this.mapEntityToDto(entity)),
        ...proximasCorridas.map((entity) => this.mapEntityToDto(entity)),
      ],
    };
  }

  private mapEntityToDto(corridaEntity: CorridaEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      localDeSaida: corridaEntity.localDeSaida,
      idMotorista: corridaEntity.idMotorista,
      chaveEmprestada: corridaEntity.chaveEmprestada,
      situacao: corridaEntity.situacao,
      nomeMotorista: corridaEntity.motorista?.nome,
      idCarro: corridaEntity.idCarro,
      placaVeiculo: corridaEntity.carro?.placa,
      dataHoraLiberacaoChave: corridaEntity.dataHoraLiberacaoChave,
      datHoraRecebimentoChave: corridaEntity.dataHoraRecebimentoChave,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridaEntity> {
    const entity: Partial<CorridaEntity> = {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      localDeSaida: corridaDto.localDeSaida,
      idMotorista: corridaDto.idMotorista,
      idCarro: corridaDto.idCarro,
      chaveEmprestada: corridaDto.chaveEmprestada || false,
    };

    if (corridaDto.situacao) {
      entity.situacao = corridaDto.situacao;
    }

    return entity;
  }
}
