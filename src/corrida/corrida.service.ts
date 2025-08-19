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
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import {
  FindOptionsWhere,
  Repository,
  Like,
  Between,
  MoreThan,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
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
    idCarros: number,
    dataInicio: Date,
    dataTermino: Date,
  ): Promise<boolean> {
    const conflitos = await this.corridaRepository.find({
      where: {
        idCarros,
        situacao: 'AGENDADA',
        dataInicio: LessThanOrEqual(dataTermino),
        dataTermino: MoreThanOrEqual(dataInicio),
      },
    });

    return conflitos.length > 0;
  }

  async create(corrida: CorridaDto): Promise<CorridaDto> {
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
      corrida.idCarros,
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
    return this.findById(newId);
  }

  async findById(idCorrida: number): Promise<CorridaDto> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
      relations: ['motorista', 'carro'],
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item com id ${idCorrida} não encontrado`);
    }
    return this.mapEntityToDto(foundCorrida);
  }

  async findAll(params: FindAllParameters): Promise<CorridaDto[]> {
    const searchParams: FindOptionsWhere<CorridasEntity> = {};

    if (params.local_de_saida) {
      searchParams.local_de_saida = Like(`%${params.local_de_saida}%`);
    }

    const corridaFound = await this.corridaRepository.find({
      where: searchParams,
      relations: ['motorista', 'carro'],
    });

    return corridaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async emprestarChave(idCorrida: number): Promise<void> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item com id ${idCorrida} não encontrado`);
    }

    foundCorrida.chaveEmprestada = !foundCorrida.chaveEmprestada;

    await this.corridaRepository.save(foundCorrida);
  }

  async atualizarSituacao(idCorrida: number, situacao: string): Promise<void> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Corrida com id ${idCorrida} não encontrada`);
    }

    const transicoesPermitidas = {
      'AGENDADA': ['ANDAMENTO', 'CANCELADA'],
      'ANDAMENTO': ['FINALIZADA', 'CANCELADA'],
      'FINALIZADA': [],
      'CANCELADA': []
    };

    const situacaoAtual = foundCorrida.situacao;

    if (!transicoesPermitidas[situacaoAtual]?.includes(situacao)) {
      throw new HttpException(
        `Transição de situação de ${situacaoAtual} para ${situacao} não é permitida`,
        HttpStatus.BAD_REQUEST
      );
    }

    foundCorrida.situacao = situacao;
    await this.corridaRepository.save(foundCorrida);
  }


  async update(idCorrida: number, corrida: CorridaDto) {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new HttpException(
        `Item com id ${idCorrida} não encontrado`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.corridaRepository.update(
      idCorrida,
      this.mapDtoToEntity(corrida),
    );
  }

  async remove(idCorrida: number) {
    const result = await this.corridaRepository.delete(idCorrida);

    if (!result.affected || result.affected === 0) {
      throw new HttpException(
        `Item com id ${idCorrida} não encontrado`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMotoristaDashboard(
    idMotorista: number,
  ): Promise<MotoristaDashboardDto> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje.getTime() + 86400000);

    const corridasEmAndamento = await this.corridaRepository.find({
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

    const corridaDeHoje =
      corridasEmAndamento.length > 0 ? corridasEmAndamento[0] : null;

    return {
      corridaDeHoje: corridaDeHoje ? this.mapEntityToDto(corridaDeHoje) : null,
      proximasCorridas: [
        ...corridasEmAndamento.slice(1).map((entity) => this.mapEntityToDto(entity)),
        ...proximasCorridas.map((entity) => this.mapEntityToDto(entity)),
      ],
    };
  }

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      local_de_saida: corridaEntity.local_de_saida,
      idMotorista: corridaEntity.idMotorista,
      chaveEmprestada: corridaEntity.chaveEmprestada,
      situacao: corridaEntity.situacao,
      nomeMotorista: corridaEntity.motorista?.nome,
      idCarros: corridaEntity.idCarros,
      placaVeiculo: corridaEntity.carro?.placa,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridasEntity> {
    const entity: Partial<CorridasEntity> = {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      local_de_saida: corridaDto.local_de_saida,
      idMotorista: corridaDto.idMotorista,
      idCarros: corridaDto.idCarros,
      chaveEmprestada: corridaDto.chaveEmprestada || false,
    };

    if (corridaDto.situacao) {
      entity.situacao = corridaDto.situacao;
    }

    return entity;
  }
}