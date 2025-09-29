import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MultasDto, FindAllParameters } from './multas.dto';
import { MultasEntity } from 'src/db/entities/multas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

@Injectable()
export class MultasService {
  constructor(
    @InjectRepository(MultasEntity)
    private readonly MultasRepository: Repository<MultasEntity>,
  ) {}
  private multas: MultasDto[] = [];

  async create(multas: MultasDto) {
    const multasToSave: MultasEntity = {
      codInfracao: multas.codInfracao,
      classInfracao: multas.classInfracao,
      valor: multas.valor,
      placaVeiculo: multas.placaVeiculo,
      data: multas.data,
      numAutoInfracao: multas.numAutoInfracao,
      deletada: multas.deletada,
    };

    return await this.MultasRepository.save(multasToSave);
  }

  async findById(idMultas: number): Promise<MultasDto> {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMultas} not found`);
    }
    return this.mapEntityToDto(foundMulta);
  }

  async findAll(params: FindAllParameters): Promise<MultasDto[]> {
    const searchParams: FindOptionsWhere<MultasEntity> = {};

    if (params.classInfracao) {
      searchParams.classInfracao = Like(`%${params.classInfracao}%`);
    }

    if (params.codInfracao) {
      searchParams.codInfracao = Like(`%${params.codInfracao}%`);
    }

    if (params.placaVeiculo) {
      searchParams.placaVeiculo = Like(`%${params.placaVeiculo}%`);
    }

    const multasFound = await this.MultasRepository.find({
      where: searchParams,
    });

    return multasFound.map((MultasEntity) => this.mapEntityToDto(MultasEntity));
  }

  async update(idMultas: number, multas: MultasDto) {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!foundMulta) {
      throw new HttpException(
        `Item with id ${multas.idMultas} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.MultasRepository.update(idMultas, this.mapDtoToEntity(multas));
  }

  async softRemove(idMultas: number) {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMultas} not found`);
    }

    foundMulta.deletada = true;

    await this.MultasRepository.save(foundMulta);
  }

  async remove(idMultas: number) {
    const result = await this.MultasRepository.delete(idMultas);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idMultas} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(MultasEntity: MultasEntity): MultasDto {
    return {
      idMultas: MultasEntity.idMultas,
      codInfracao: MultasEntity.codInfracao,
      classInfracao: MultasEntity.classInfracao,
      valor: MultasEntity.valor,
      placaVeiculo: MultasEntity.placaVeiculo,
      data: MultasEntity.data,
      numAutoInfracao: MultasEntity.numAutoInfracao,
      deletada: MultasEntity.deletada,
    };
  }

  private mapDtoToEntity(MultasDto: MultasDto): Partial<MultasEntity> {
    return {
      codInfracao: MultasDto.classInfracao,
      classInfracao: MultasDto.codInfracao,
      valor: MultasDto.valor,
      placaVeiculo: MultasDto.placaVeiculo,
      data: MultasDto.data,
      numAutoInfracao: MultasDto.numAutoInfracao,
    };
  }
}
