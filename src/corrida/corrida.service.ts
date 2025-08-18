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
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }
    return this.mapEntityToDto(foundCorrida);
  }

  async findAll(params: FindAllParameters): Promise<CorridaDto[]> {
    const searchParams: FindOptionsWhere<CorridasEntity> = {};

   /* if (params.itinerario) {
      searchParams.itinerario = Like(`%${params.itinerario}%`);
    } */

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
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }

    if (foundCorrida.chaveEmprestada == false) {
      foundCorrida.chaveEmprestada = true;
    } else {
      foundCorrida.chaveEmprestada = false;
    }

    await this.corridaRepository.save(foundCorrida);
  }

  async update(idCorrida: number, corrida: CorridaDto) {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new HttpException(
        `Item with id ${idCorrida} not found`,
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

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idCorrida} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMotoristaDashboard(
    idMotorista: number,
  ): Promise<MotoristaDashboardDto> {
    const inicioDoDia = new Date(new Date().setHours(0, 0, 0, 0));
    const fimDoDia = new Date(new Date().setHours(23, 59, 59, 999));

    const corridaDeHoje = await this.corridaRepository.findOne({
      where: {
        idMotorista,
        situacao: 'AGENDADA',
        dataInicio: Between(inicioDoDia, fimDoDia),
      },
      relations: ['carro'],
    });

    const proximasCorridas = await this.corridaRepository.find({
      where: {
        idMotorista,
        situacao: 'AGENDADA',
        dataInicio: MoreThan(fimDoDia),
      },
      order: {
        dataInicio: 'ASC',
      },
      relations: ['carro'],
    });

    return {
      corridaDeHoje: corridaDeHoje ? this.mapEntityToDto(corridaDeHoje) : null,
      proximasCorridas: proximasCorridas.map((entity) =>
        this.mapEntityToDto(entity),
      ),
    };
  }

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
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