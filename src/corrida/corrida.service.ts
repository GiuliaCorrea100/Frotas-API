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

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  private corrida: CorridaDto[] = [];

  async create(corrida: CorridaDto) {
    const corridaTosave: CorridasEntity = {
      dataInicio: corrida.dataInicio,
      dataTermino: corrida.dataTermino,
      distanciaKm: corrida.distanciaKm,
      itinerario: corrida.itinerario,
    };

    return await this.corridaRepository.save(corridaTosave);
  }

  async findById(idCorrida: number): Promise<CorridaDto> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
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
    });

    return corridaFound.map((CorridasEntity) =>
      this.mapEntityToDto(CorridasEntity),
    );
  }

  async update(idCorrida: number, corrida: CorridaDto) {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new HttpException(
        `Item with id ${corrida.idCorrida} not found`,
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

  private mapEntityToDto(CorridasEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: CorridasEntity.idCorrida,
      dataInicio: CorridasEntity.dataInicio,
      dataTermino: CorridasEntity.dataTermino,
      distanciaKm: CorridasEntity.distanciaKm,
      itinerario: CorridasEntity.itinerario,
    };
  }

  private mapDtoToEntity(CorridaDto: CorridaDto): Partial<CorridasEntity> {
    return {
      dataInicio: CorridaDto.dataInicio,
      dataTermino: CorridaDto.dataTermino,
      distanciaKm: CorridaDto.distanciaKm,
      itinerario: CorridaDto.itinerario,
    };
  }
}
