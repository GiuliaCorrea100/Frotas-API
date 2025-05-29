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
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { CorridasEntity } from 'src/db/entities/corrida.entity';

@Injectable()
export class AbastecimentoService {
  constructor(
    @InjectRepository(AbastecimentoEntity)
    private readonly abastecimentoRepository: Repository<AbastecimentoEntity>,
  ) {}

  private abastecimento: AbastecimentoDto[] = [];

  async create(abastecimento: AbastecimentoDto) {
    const abastecimentoToSave: AbastecimentoEntity = {
      litros: abastecimento.litros,
      codPagamento: abastecimento.codPagamento,
      precoFinal: abastecimento.precoFinal,
      dataAbastecimento: abastecimento.dataAbastecimento,

      valorUnitarioLitro: abastecimento.valorUnitarioLitro,
      valorMedioLitro: abastecimento.valorMedioLitro,
      valorUnitario: abastecimento.valorUnitario,
      valorMedio: abastecimento.valorMedio,
      justificativaAlteracao: abastecimento.justificativaAlteracao,
      
      tipo_combustivel: new TipoCombustivelEntity,
      corrida: new CorridasEntity
    };

    return await this.abastecimentoRepository.save(abastecimentoToSave);
  }

  async findById(idAbastecimento: number): Promise<AbastecimentoDto> {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    return this.mapEntityToDto(foundAbastecimento);
  }

  async findAll(params: FindAllParameters): Promise<AbastecimentoDto[]> {
    const searchParams: FindOptionsWhere<AbastecimentoEntity> = {};

    /*if (params.dataAbastecimento) {
      searchParams.dataAbastecimento = Like(`%${params.dataAbastecimento}`);
    }*/

    if (params.tipoCombustivel) {
      searchParams.tipo_combustivel = Like(`%${params.tipoCombustivel}`);
    }

    const abastecimentoFound = await this.abastecimentoRepository.find({
      where: searchParams,
    });

    return abastecimentoFound.map((AbastecimentoEntity) =>
      this.mapEntityToDto(AbastecimentoEntity),
    );
  }

  async update(idAbastecimento: number, abastecimento: AbastecimentoDto) {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!foundAbastecimento) {
      throw new HttpException(
        `Item with id ${abastecimento.idAbastecimento} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.abastecimentoRepository.update(
      idAbastecimento,
      this.mapDtoToentity(abastecimento),
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

  private mapEntityToDto(
    AbastecimentoEntity: AbastecimentoEntity,
  ): AbastecimentoDto {
    return {
      idAbastecimento: AbastecimentoEntity.idAbastecimento,
      litros: AbastecimentoEntity.litros,
      codPagamento: AbastecimentoEntity.codPagamento,
      precoFinal: AbastecimentoEntity.precoFinal,
      dataAbastecimento: AbastecimentoEntity.dataAbastecimento,

      valorUnitarioLitro: AbastecimentoEntity.valorUnitarioLitro,
      valorMedioLitro: AbastecimentoEntity.valorMedioLitro,
      valorUnitario: AbastecimentoEntity.valorUnitario,
      valorMedio: AbastecimentoEntity.valorMedio,
      justificativaAlteracao: AbastecimentoEntity.justificativaAlteracao,

    };
  }

  private mapDtoToentity(
    AbastecimentoDto: AbastecimentoDto,
  ): Partial<AbastecimentoEntity> {
    return {
      litros: AbastecimentoDto.litros,
      codPagamento: AbastecimentoDto.codPagamento,
      precoFinal: AbastecimentoDto.precoFinal,
      dataAbastecimento: AbastecimentoDto.dataAbastecimento,

      valorUnitarioLitro: AbastecimentoDto.valorUnitarioLitro,
      valorMedioLitro: AbastecimentoDto.valorMedioLitro,
      valorUnitario: AbastecimentoDto.valorUnitario,
      valorMedio: AbastecimentoDto.valorMedio,
      justificativaAlteracao: AbastecimentoDto.justificativaAlteracao,
    };
  }
}
