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
      codigoInfracao: multas.codigoInfracao,
      classificacao: multas.classificacao,
      valorInfracao: multas.valorInfracao,
      placaVeiculo: multas.placaVeiculo,
      dataInfracao: multas.dataInfracao,
      autoInfracao: multas.autoInfracao,
      //deletada: multas.deletada,
    };

    return await this.MultasRepository.save(multasToSave);
  }

  async findById(idMulta: number): Promise<MultasDto> {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }
    return this.mapEntityToDto(foundMulta);
  }

  async findAll(params: FindAllParameters): Promise<MultasDto[]> {
    const searchParams: FindOptionsWhere<MultasEntity> = {};

    if (params.classificacao) {
      searchParams.classificacao = Like(`%${params.classificacao}%`);
    }

    if (params.codigoInfracao) {
      searchParams.codigoInfracao = params.codigoInfracao;
    }

    if (params.placaVeiculo) {
      searchParams.placaVeiculo = Like(`%${params.placaVeiculo}%`);
    }

    if (params.valorInfracao) {
      searchParams.valorInfracao = params.valorInfracao;
    }

    if (params.dataInfracao) {
      searchParams.dataInfracao = params.dataInfracao;
    }

    const multasFound = await this.MultasRepository.find({
      where: searchParams,
    });

    return multasFound.map((MultasEntity) => this.mapEntityToDto(MultasEntity));
  }

  async update(idMulta: number, multa: MultasDto) {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new HttpException(
        `Item with id ${multa.idMulta} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.MultasRepository.update(idMulta, this.mapDtoToEntity(multa));
  }

  async softRemove(idMulta: number) {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }

    foundMulta.deletada = true;

    await this.MultasRepository.save(foundMulta);
  }

  async remove(idMulta: number) {
    // Corrigido nome do parâmetro
    const result = await this.MultasRepository.delete(idMulta);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idMulta} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(MultasEntity: MultasEntity): MultasDto {
    return {
      idMulta: MultasEntity.idMulta,
      codigoInfracao: MultasEntity.codigoInfracao,
      classificacao: MultasEntity.classificacao,
      valorInfracao: MultasEntity.valorInfracao,
      placaVeiculo: MultasEntity.placaVeiculo,
      dataInfracao: MultasEntity.dataInfracao,
      autoInfracao: MultasEntity.autoInfracao,
      deletada: MultasEntity.deletada,
    };
  }

  private mapDtoToEntity(MultasDto: MultasDto): Partial<MultasEntity> {
    return {
      codigoInfracao: MultasDto.codigoInfracao,
      classificacao: MultasDto.classificacao,
      valorInfracao: MultasDto.valorInfracao,
      placaVeiculo: MultasDto.placaVeiculo,
      dataInfracao: MultasDto.dataInfracao,
      autoInfracao: MultasDto.autoInfracao,
      deletada: MultasDto.deletada,
    };
  }
}
