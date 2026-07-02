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
import { CorridaMotoristaEntity } from 'src/db/entities/corrida-motorista.entity';
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
import { EmailService } from 'src/email/email.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { carroService } from 'src/carro/carro.service';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridaEntity)
    private readonly corridaRepository: Repository<CorridaEntity>,
    @InjectRepository(CorridaMotoristaEntity)
    private readonly corridaMotoristaRepository: Repository<CorridaMotoristaEntity>,
    private readonly logService: LogService,
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,
    private readonly carroService: carroService,
  ) {}

  async verificarConflitoDeCorrida(
    idMotorista: number,
    dataInicio: Date,
    dataTermino: Date,
  ): Promise<boolean> {
    const conflitos = await this.corridaRepository.find({
      where: {
        idMotoristaPrincipal: idMotorista,
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

    const motoristasIds = corrida.motoristasIds?.length
      ? corrida.motoristasIds
      : [corrida.idMotoristaPrincipal];

    for (const idMotorista of motoristasIds) {
      const conflitoMotorista = await this.verificarConflitoDeCorrida(
        idMotorista,
        new Date(corrida.dataInicio),
        new Date(corrida.dataTermino),
      );
      if (conflitoMotorista) {
        throw new HttpException(
          'Já existe uma corrida agendada para esse usuário nesse período!',
          HttpStatus.CONFLICT,
        );
      }
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

    corrida.idMotoristaPrincipal = motoristasIds[0];
    const corridaToSave = this.mapDtoToEntity(corrida);
    corridaToSave.situacao = 'AGENDADA';

    const insertResult = await this.corridaRepository.insert(corridaToSave);
    const identifiers = insertResult.identifiers as { idCorrida: number }[];
    const newId = identifiers[0].idCorrida;

    if (!newId) {
      throw new Error('Falha ao criar a corrida, o ID não foi gerado.');
    }

    await this.corridaRepository.save(corridaToSave);

    for (const idMotorista of motoristasIds) {
      await this.corridaMotoristaRepository.insert({
        idCorrida: newId,
        idMotorista,
      });
    }

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
      relations: [
        'motoristaPrincipal',
        'carro',
        'motoristas',
        'motoristas.motorista',
      ],
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
      relations: [
        'motoristaPrincipal',
        'carro',
        'motoristas',
        'motoristas.motorista',
      ],
      order: {
        dataInicio: 'DESC',
      },
    });

    return corridaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async findByAno(ano: number): Promise<CorridaEntity[]> {
    const inicio = new Date(ano, 0, 1, 0, 0, 0);
    const fim = new Date(ano, 11, 31, 23, 59, 59);
    return this.corridaRepository.find({
      where: { dataInicio: Between(inicio, fim) },
      relations: [
        'motoristaPrincipal',
        'carro',
        'motoristas',
        'motoristas.motorista',
      ],
    });
  }

  async emprestarChave(
    idCorrida: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
      relations: ['motoristaPrincipal'],
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
      foundCorrida.situacao = 'FINALIZADA';

      const administrador = await this.usuarioService.findById(currentUserId);
      const motorista = await this.usuarioService.findById(
        foundCorrida.idMotoristaPrincipal,
      );
      const veiculo = await this.carroService.findById(foundCorrida.idCarro);
      const dataFormatada =
        foundCorrida.dataHoraRecebimentoChave.toLocaleDateString('pt-BR');
      const horaFormatada =
        foundCorrida.dataHoraRecebimentoChave.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });

      await this.emailService.sendMail(
        motorista.email,
        'Confirmação de entrega de chave',
        'confirmacaoEntregaChave.hbs',
        {
          motorista: motorista.nome,
          administrador: administrador.nome,
          placa: veiculo.placa,
          data: dataFormatada,
          hora: horaFormatada,
        },
      );
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
      ANDAMENTO: ['FINALIZADA', 'CONCLUIDA'],
      CONCLUIDA: ['FINALIZADA'],
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
      idMotoristaPrincipal?: number;
      idCarro?: number;
      motoristasIds?: number[];
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
      idMotoristaPrincipal:
        dados.idMotoristaPrincipal ?? corrida.idMotoristaPrincipal,
      idCarro: dados.idCarro ?? corrida.idCarro,
    });

    if (dados.motoristasIds) {
      await this.corridaMotoristaRepository.delete({ idCorrida });
      for (const idMotorista of dados.motoristasIds) {
        await this.corridaMotoristaRepository.insert({
          idCorrida,
          idMotorista,
        });
      }
    }

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

    if (corrida.motoristasIds) {
      await this.corridaMotoristaRepository.delete({ idCorrida });
      for (const idMotorista of corrida.motoristasIds) {
        await this.corridaMotoristaRepository.insert({
          idCorrida,
          idMotorista,
        });
      }
    }

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

    await this.corridaMotoristaRepository.delete({ idCorrida });

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

    const corridasAgendadasHoje = await this.corridaRepository
      .createQueryBuilder('corrida')
      .leftJoinAndSelect('corrida.carro', 'carro')
      .innerJoin('corrida.motoristas', 'cm')
      .where('corrida.situacao = :situacao', { situacao: 'AGENDADA' })
      .andWhere('cm.idMotorista = :idMotorista', { idMotorista })
      .andWhere(
        'corrida.data_inicio <= :amanha AND corrida.data_termino >= :hoje',
        { amanha, hoje },
      )
      .orderBy('corrida.data_inicio', 'ASC')
      .distinct(true)
      .getMany();

    const corridasEmAndamento = await this.corridaRepository
      .createQueryBuilder('corrida')
      .leftJoinAndSelect('corrida.carro', 'carro')
      .innerJoin('corrida.motoristas', 'cm')
      .where('corrida.situacao = :situacao', { situacao: 'ANDAMENTO' })
      .andWhere('cm.idMotorista = :idMotorista', { idMotorista })
      .distinct(true)
      .getMany();

    const corridasFinalizadasHoje = await this.corridaRepository
      .createQueryBuilder('corrida')
      .leftJoinAndSelect('corrida.carro', 'carro')
      .innerJoin('corrida.motoristas', 'cm')
      .where('corrida.situacao = :situacao', { situacao: 'FINALIZADA' })
      .andWhere('cm.idMotorista = :idMotorista', { idMotorista })
      .andWhere('corrida.data_inicio BETWEEN :hoje AND :amanha', {
        hoje,
        amanha,
      })
      .orderBy('corrida.data_inicio', 'DESC')
      .distinct(true)
      .getMany();

    const proximasCorridas = await this.corridaRepository
      .createQueryBuilder('corrida')
      .leftJoinAndSelect('corrida.carro', 'carro')
      .innerJoin('corrida.motoristas', 'cm')
      .where('corrida.situacao = :situacao', { situacao: 'AGENDADA' })
      .andWhere('cm.idMotorista = :idMotorista', { idMotorista })
      .andWhere('corrida.data_inicio > :amanha', { amanha })
      .orderBy('corrida.data_inicio', 'ASC')
      .distinct(true)
      .getMany();

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

  async encontrarCorridaPorPlacaEData(
    placaVeiculo: string,
    dataInfracao: Date,
  ): Promise<CorridaDto | null> {
    try {
      const corrida = await this.corridaRepository
        .createQueryBuilder('corrida')
        .innerJoinAndSelect('corrida.carro', 'carro')
        .innerJoinAndSelect('corrida.motoristaPrincipal', 'motoristaPrincipal')
        .where('carro.placa = :placa', { placa: placaVeiculo })
        .andWhere('corrida.situacao = :situacao', { situacao: 'FINALIZADA' })
        .andWhere(
          ':dataInfracao BETWEEN corrida.dataInicio AND corrida.dataTermino',
        )
        .setParameter('dataInfracao', dataInfracao)
        .getOne();

      return corrida ? this.mapEntityToDto(corrida) : null;
    } catch (error) {
      console.error('Erro ao buscar corrida por placa e data:', error);
      return null;
    }
  }

  async encontrarMotoristaPorPlacaEData(
    placaVeiculo: string,
    data: Date,
  ): Promise<{
    idMotoristaPrincipal: number;
    nomeMotorista: string;
  } | null> {
    const corrida = await this.corridaRepository.findOne({
      where: {
        carro: {
          placa: placaVeiculo,
        },
        dataInicio: LessThanOrEqual(data),
        dataTermino: MoreThanOrEqual(data),
      },
      relations: ['motoristaPrincipal', 'carro'],
    });

    if (!corrida) return null;

    return {
      idMotoristaPrincipal: corrida.idMotoristaPrincipal,
      nomeMotorista: corrida.motoristaPrincipal?.nome || null,
    };
  }

  async encontrarMotoristaPorPlacaEHorarioExato(
    placaVeiculo: string,
    dataHoraInfracao: Date,
  ): Promise<{ idMotorista: number; nomeMotorista: string } | null> {
    const corrida = await this.corridaRepository.findOne({
      where: {
        carro: { placa: placaVeiculo },
        dataHoraLiberacaoChave: LessThanOrEqual(dataHoraInfracao),
        dataHoraRecebimentoChave: MoreThanOrEqual(dataHoraInfracao),
        situacao: 'FINALIZADA',
      },
      relations: ['motoristaPrincipal', 'carro'],
    });

    if (!corrida) return null;

    return {
      idMotorista: corrida.idMotoristaPrincipal,
      nomeMotorista:
        corrida.motoristaPrincipal?.nome || 'Motorista não identificado',
    };
  }

  async encontrarMotoristaPorPlacaEPeriodoChave(
    placaVeiculo: string,
    dataHoraInfracao: Date,
  ): Promise<{ idMotorista: number; nomeMotorista: string } | null> {
    const placaFormatada = placaVeiculo.toUpperCase().trim();
    const dataFiltro = new Date(dataHoraInfracao);

    const corrida = await this.corridaRepository
      .createQueryBuilder('corrida')
      .innerJoinAndSelect('corrida.carro', 'carro')
      .innerJoinAndSelect('corrida.motoristaPrincipal', 'motoristaPrincipal')
      .where('UPPER(carro.placa) = :placa', { placa: placaFormatada })
      .andWhere('corrida.situacao = :situacao', { situacao: 'FINALIZADA' })
      .andWhere('corrida.data_hora_liberacao_chave <= :dataHora', { dataHora: dataFiltro })
      .andWhere('corrida.data_hora_recebimento_chave >= :dataHora', { dataHora: dataFiltro })
      .getOne();

    if (!corrida) {
      return null;
    }

    return {
      idMotorista: corrida.idMotoristaPrincipal,
      nomeMotorista: corrida.motoristaPrincipal?.nome || 'Motorista Principal',
    };
  }

  private mapEntityToDto(corridaEntity: CorridaEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      localDeSaida: corridaEntity.localDeSaida,
      idMotoristaPrincipal: corridaEntity.idMotoristaPrincipal,
      chaveEmprestada: corridaEntity.chaveEmprestada,
      situacao: corridaEntity.situacao,
      nomeMotoristaPrincipal: corridaEntity.motoristaPrincipal?.nome,
      idCarro: corridaEntity.idCarro,
      placaVeiculo: corridaEntity.carro?.placa,
      dataHoraLiberacaoChave: corridaEntity.dataHoraLiberacaoChave,
      dataHoraRecebimentoChave: corridaEntity.dataHoraRecebimentoChave,
      motoristas: corridaEntity.motoristas?.map((cm) => ({
        idMotorista: cm.idMotorista,
        nome: cm.motorista?.nome || '',
      })),
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridaEntity> {
    const entity: Partial<CorridaEntity> = {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      localDeSaida: corridaDto.localDeSaida,
      idMotoristaPrincipal: corridaDto.idMotoristaPrincipal,
      idCarro: corridaDto.idCarro,
      chaveEmprestada: corridaDto.chaveEmprestada || false,
    };

    if (corridaDto.situacao) {
      entity.situacao = corridaDto.situacao;
    }

    return entity;
  }
}
