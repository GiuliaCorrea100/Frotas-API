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
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  async create(corrida: CorridaDto): Promise<CorridaDto> {
    const corridaToSave = this.mapDtoToEntity(corrida);
    const savedEntity = await this.corridaRepository.save(corridaToSave);
    return this.mapEntityToDto(savedEntity);
  }

  async findById(idCorrida: number): Promise<CorridaDto> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
      relations: ['motorista'],
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
      relations: ['motorista'],
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

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      itinerario: corridaEntity.itinerario,
      tomboCarro: corridaEntity.tomboCarro,
      numeroIdMotorista: corridaEntity.motorista?.idPessoa,
      nomeMotorista: corridaEntity.motorista?.nome,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridasEntity> {
    return {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      itinerario: corridaDto.itinerario,
      tomboCarro: corridaDto.tomboCarro,
      motorista: { idPessoa: corridaDto.numeroIdMotorista } as UserSinguEntity,
    };
  }
}
