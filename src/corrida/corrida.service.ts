import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CorridaDto, FindAllParameters } from './corrida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { FindOptionsWhere, Repository, Like } from 'typeorm';
//import { UserEntity } from 'src/db/entities/users.entity';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  async create(corrida: CorridaDto): Promise<CorridaDto> {
    const corridaToSave = this.mapDtoToEntity(corrida);

    const insertResult = await this.corridaRepository.insert(corridaToSave);

    const identifiers = insertResult.identifiers as { idCorrida: number }[];
    const newId = identifiers[0].idCorrida;

    if (!newId) {
      throw new Error('Falha ao criar a corrida, o ID não foi gerado.');
    }

    const savedEntity = await this.corridaRepository.save(corridaToSave);

    return this.findById(newId);

    console.log(savedEntity);

    return this.mapEntityToDto(savedEntity);
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

  async emprestarChave(idCorrida: number): Promise<void> {
    //busca a corrida no banco
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

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      itinerario: corridaEntity.itinerario,
      idMotorista: corridaEntity.idMotorista,
      chaveEmprestada: corridaEntity.chaveEmprestada,
      situacao: corridaEntity.situacao,
      nomeMotorista: corridaEntity.motorista?.nome,
      idCarros: corridaEntity.idCarros,
      placaVeiculo: corridaEntity.carro?.placa,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridasEntity> {
    return {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      itinerario: corridaDto.itinerario,
      idMotorista: corridaDto.idMotorista,
      idCarros: corridaDto.idCarros,
    };
  }
}
