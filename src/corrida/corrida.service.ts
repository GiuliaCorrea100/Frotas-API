import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CorridaDto, FindAllParameters, MotoristaDashboardDto } from './corrida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { FindOptionsWhere, Repository, Like, Between, MoreThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { UserEntity } from 'src/db/entities/users.entity';


@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  async verificarConflitoDeCorrida(idMotorista: number, dataInicio: Date, dataTermino: Date): Promise<boolean> {
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

  async create(corrida: CorridaDto): Promise<CorridaDto> {
    const existeConflito = await this.verificarConflitoDeCorrida(
      corrida.idMotorista,
      new Date(corrida.dataInicio),
      new Date(corrida.dataTermino)
    );

    if (existeConflito) {
      throw new HttpException(
        'Já existe uma corrida agendada para esse usuário nesse período!',
        HttpStatus.CONFLICT,
      );
    }

    const corridaToSave = this.mapDtoToEntity(corrida);
    corridaToSave.situacao = 'AGENDADA';

    const insertResult = await this.corridaRepository.insert(corridaToSave);
    const newId = insertResult.identifiers[0].idCorrida;

    if (!newId) {
      throw new Error("Falha ao criar a corrida, o ID não foi gerado.");
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

    if (params.itinerario) {
      searchParams.itinerario = Like(`%${params.itinerario}%`);
    }

    const corridaFound = await this.corridaRepository.find({
      where: searchParams,
      relations: ['motorista', 'carro'],
    });

    return corridaFound.map((entity) => this.mapEntityToDto(entity));
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

  async getMotoristaDashboard(idMotorista: number): Promise<MotoristaDashboardDto> {
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
      proximasCorridas: proximasCorridas.map(entity => this.mapEntityToDto(entity)),
    };
  }

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      itinerario: corridaEntity.itinerario,
      idMotorista: corridaEntity.idMotorista,
      nomeMotorista: corridaEntity.motorista?.nome,
      idCarros: corridaEntity.idCarros,
      placaVeiculo: corridaEntity.carro?.placa,
      situacao: corridaEntity.situacao,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridasEntity> {
    const entity: Partial<CorridasEntity> = {
        dataInicio: corridaDto.dataInicio,
        dataTermino: corridaDto.dataTermino,
        distanciaKm: corridaDto.distanciaKm,
        itinerario: corridaDto.itinerario,
        idMotorista: corridaDto.idMotorista,
        idCarros: corridaDto.idCarros,
    };

    if (corridaDto.situacao) {
        entity.situacao = corridaDto.situacao;
    }

    return entity;
  }
}