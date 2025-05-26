import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbastecimentoEntity } from 'src/db/entities/abastecimento.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';

@Injectable()
export class AbastecimentoService {
  constructor(
    @InjectRepository(AbastecimentoEntity)
    private readonly abastecimentoRepository: Repository<AbastecimentoEntity>,
  ) {}

  async create(abastecimento: AbastecimentoDto) {
    const abastecimentoToSave: Partial<AbastecimentoEntity> = {
      litros: abastecimento.litros,
      codPagamento: abastecimento.codPagamento,
      precoFinal: abastecimento.precoFinal,
      dataAbastecimento: abastecimento.dataAbastecimento,
    };

    return await this.abastecimentoRepository.save(abastecimentoToSave);
  }

  

  async findById(idAbastecimento: number): Promise<AbastecimentoDto> {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
      relations: ['corrida'],
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    return this.mapEntityToDto(foundAbastecimento);
  }

  async findAll(params: FindAllParameters): Promise<AbastecimentoDto[]> {
    const where: FindOptionsWhere<AbastecimentoEntity> = {};

    if (params.dataAbastecimento) {
      where.dataAbastecimento = params.dataAbastecimento;
    }

    if (params.tipoCombustivel) {

      where.tipoCombustivel = Like(`%${params.tipoCombustivel}%`);
    }

    const results = await this.abastecimentoRepository.find({
      where,
      relations: ['corrida'],
    });

    return results.map(this.mapEntityToDto);
  }

  async update(idAbastecimento: number, abastecimento: AbastecimentoDto) {
    const found = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!found) {
      throw new HttpException(
        `Item with id ${idAbastecimento} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.abastecimentoRepository.update(
      idAbastecimento,
      this.mapDtoToEntity(abastecimento),
    );
  }

  async remove(idAbastecimento: number) {
    const result = await this.abastecimentoRepository.delete(idAbastecimento);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idAbastecimento} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(entity: AbastecimentoEntity): AbastecimentoDto {
    return {
      idAbastecimento: entity.idAbastecimento,
      litros: entity.litros,
      codPagamento: entity.codPagamento,
      precoFinal: entity.precoFinal,
      dataAbastecimento: entity.dataAbastecimento,
    };
  }

  private mapDtoToEntity(dto: AbastecimentoDto): AbastecimentoEntity {
    const entity = new AbastecimentoEntity();
    entity.idAbastecimento = dto.idAbastecimento;
    entity.litros = dto.litros;
    entity.codPagamento = dto.codPagamento;
    entity.precoFinal = dto.precoFinal;
    entity.dataAbastecimento = dto.dataAbastecimento;

    return entity;
  }

}
