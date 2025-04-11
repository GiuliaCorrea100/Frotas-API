import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, CarrosDto } from './carros.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class CarrosService {
  constructor(
    @InjectRepository(CarrosEntity)
    private readonly carrosRepository: Repository<CarrosEntity>,
  ) {}

  private carros: CarrosDto[] = [];

  async create(carros: CarrosDto) {
    const carrosToSave: CarrosEntity = {
      tombo: carros.tombo,
      qrCode: carros.qrCode,
      modelo: carros.modelo,
      placa: carros.placa,
      odometro: carros.odometro,
      ano: carros.ano,
    };

    return await this.carrosRepository.save(carrosToSave);
    //return this.mapEntityToDto(createdCarros);
  }

  async findById(idCarros: number): Promise<CarrosDto> {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarros },
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${idCarros} not found`);
    }

    return this.mapEntityToDto(foundCarro);
  }

  async findAll(params: FindAllParameters): Promise<CarrosDto[]> {
    const searchParams: FindOptionsWhere<CarrosEntity> = {};

    if (params.modelo) {
      searchParams.modelo = Like(`%${params.modelo}%`);
    }

    if (params.ano) {
      searchParams.ano = Equal(params.ano);
    }

    const carrosFound = await this.carrosRepository.find({
      where: searchParams,
    });

    return carrosFound.map((CarrosEntity) => this.mapEntityToDto(CarrosEntity));
  }

  async update(idCarros: number, carros: CarrosDto) {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarros },
    });

    if (!foundCarro) {
      throw new HttpException(
        `Item with id ${carros.idCarros} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.carrosRepository.update(idCarros, this.mapDtoToentity(carros));
  }

  async remove(idCarros: number) {
    const result = await this.carrosRepository.delete(idCarros);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idCarros} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(CarrosEntity: CarrosEntity): CarrosDto {
    return {
      idCarros: CarrosEntity.idCarros,
      tombo: CarrosEntity.tombo,
      qrCode: CarrosEntity.qrCode,
      placa: CarrosEntity.placa,
      odometro: CarrosEntity.odometro,
      modelo: CarrosEntity.modelo,
      ano: CarrosEntity.ano,
    };
  }

  private mapDtoToentity(carrosDto: CarrosDto): Partial<CarrosEntity> {
    return {
      tombo: carrosDto.tombo,
      qrCode: carrosDto.qrCode,
      placa: carrosDto.placa,
      odometro: carrosDto.odometro,
      modelo: carrosDto.modelo,
      ano: carrosDto.ano,
    };
  }
}
