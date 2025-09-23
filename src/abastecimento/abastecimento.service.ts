import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbastecimentoEntity } from 'src/db/entities/abastecimento.entity';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';

@Injectable()
export class AbastecimentoService {
  constructor(
    @InjectRepository(AbastecimentoEntity)
    private readonly abastecimentoRepository: Repository<AbastecimentoEntity>,

    @InjectRepository(TipoCombustivelEntity)
    private readonly tipoCombustivelRepository: Repository<TipoCombustivelEntity>,

    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  async create(abastecimento: AbastecimentoDto): Promise<AbastecimentoDto> {
    // Verificar se o tipo de combustível existe

    const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
      where: { id_tipo_combustivel: abastecimento.idTipoCombustivel },
    });

    if (!tipoCombustivel) {
      throw new NotFoundException(
        `Tipo de combustível com id ${abastecimento.idTipoCombustivel} não encontrado`,
      );
    }

    const corrida = await this.corridaRepository.findOne({
      where: { idCorrida: abastecimento.idCorrida },
    });

    if (!corrida) {
      throw new NotFoundException(
        `Corrida com id ${abastecimento.idCorrida} não encontrada`,
      );
    }
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
      idTipoCombustivel: abastecimento.idTipoCombustivel, //aqui ta salvando a relação inteira e ta dando problema de relacionar o id (numero)
      idCorrida: corrida,
    };

    const savedEntity =
      await this.abastecimentoRepository.save(abastecimentoToSave);
    return this.mapEntityToDto(savedEntity);
  }

  async findById(idAbastecimento: number): Promise<AbastecimentoDto> {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
      relations: ['tipoCombustivel', 'idCorrida'],
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(
        `Abastecimento com id ${idAbastecimento} não encontrado`,
      );
    }

    return this.mapEntityToDto(foundAbastecimento);
  }

  async findByIdCorrida(idCorrida: number): Promise<AbastecimentoDto[]> {
    const foundAbastecimentos = await this.abastecimentoRepository
      .createQueryBuilder('abastecimento')
      .leftJoinAndSelect('abastecimento.tipoCombustivel', 'combustivel')
      .leftJoinAndSelect('abastecimento.idCorrida', 'corrida')
      .where('abastecimento.idCorrida = :idCorrida', { idCorrida })
      .getMany();

    if (!foundAbastecimentos) {
      throw new NotFoundException(
        `Nenhum abastecimento encontrado para corrida ${idCorrida}`,
      );
    }
    return foundAbastecimentos.map((entity) => this.mapEntityToDto(entity));
  }

  async findAll(params: FindAllParameters): Promise<AbastecimentoDto[]> {
    const searchParams: FindOptionsWhere<AbastecimentoEntity> = {};

    if (params.dataAbastecimento) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      searchParams.dataAbastecimento = Like(`%${params.dataAbastecimento}%`);
    }

    const abastecimentosFound = await this.abastecimentoRepository.find({
      where: searchParams,
      relations: ['tipoCombustivel', 'idCorrida'],
    });

    return abastecimentosFound.map((entity) => this.mapEntityToDto(entity));
  }

  async update(idAbastecimento: number, abastecimento: AbastecimentoDto) {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!foundAbastecimento) {
      throw new HttpException(
        `Abastecimento com id ${idAbastecimento} não encontrado`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar se precisa atualizar as relações
    const updateData: Partial<AbastecimentoEntity> =
      this.mapDtoToEntity(abastecimento);

    // Se houver alteração no tipo de combustível, carregar a entidade
    if (abastecimento.idTipoCombustivel !== undefined) {
      const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
        where: { id_tipo_combustivel: abastecimento.idTipoCombustivel },
      });

      if (!tipoCombustivel) {
        throw new NotFoundException(
          `Tipo de combustível com id ${abastecimento.idTipoCombustivel} não encontrado`,
        );
      }
      updateData.idTipoCombustivel = abastecimento.idTipoCombustivel;
    }

    // Se houver alteração na corrida, carregar a entidade
    if (abastecimento.idCorrida !== undefined) {
      const corrida = await this.corridaRepository.findOne({
        where: { idCorrida: abastecimento.idCorrida },
      });

      if (!corrida) {
        throw new NotFoundException(
          `Corrida com id ${abastecimento.idCorrida} não encontrada`,
        );
      }
      updateData.idCorrida = corrida;
    }

    await this.abastecimentoRepository.update(idAbastecimento, updateData);
  }

  async updateAbastecimento(id: number, abastecimento: AbastecimentoDto) {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento: id },
    });

    if (!foundAbastecimento) {
      throw new HttpException(
        `Item with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    foundAbastecimento.litros = abastecimento.litros;
    foundAbastecimento.precoFinal = abastecimento.precoFinal;
    foundAbastecimento.valorUnitario = abastecimento.valorUnitario;
    foundAbastecimento.dataAbastecimento = abastecimento.dataAbastecimento;

    return await this.abastecimentoRepository.save(foundAbastecimento);
  }

  async remove(idAbastecimento: number) {
    const result = await this.abastecimentoRepository.delete(idAbastecimento);

    if (!result.affected) {
      throw new HttpException(
        `Abastecimento com id ${idAbastecimento} não encontrado`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getGastosPorCampus(): Promise<
    { campus: string; totalGasto: number }[]
  > {
    const gastos = await this.abastecimentoRepository
      .createQueryBuilder('abastecimento')
      .innerJoin('abastecimento.idCorrida', 'corrida')
      .innerJoin('corrida.carro', 'carro')
      .groupBy('carro.localidade_fisica')
      .select('carro.localidade_fisica', 'campus')
      .addSelect('SUM(abastecimento.precoFinal)', 'totalGasto')
      .getRawMany();

    return gastos.map((item) => ({
      campus: item.campus,
      totalGasto: parseFloat(item.totalGasto),
    }));
  }

  private mapEntityToDto(entity: AbastecimentoEntity): AbastecimentoDto {
    return {
      idAbastecimento: entity.idAbastecimento,
      litros: entity.litros,
      codPagamento: entity.codPagamento,
      precoFinal: entity.precoFinal,
      dataAbastecimento: entity.dataAbastecimento,
      valorUnitarioLitro: entity.valorUnitarioLitro,
      valorMedioLitro: entity.valorMedioLitro,
      valorUnitario: entity.valorUnitario,
      valorMedio: entity.valorMedio,
      justificativaAlteracao: entity.justificativaAlteracao,
      idTipoCombustivel: entity.idTipoCombustivel,
      nomeTipoCombustivel: entity.tipoCombustivel?.nome ?? null,
      idCorrida: entity.idCorrida?.idCorrida,
    };
  }

  private mapDtoToEntity(dto: AbastecimentoDto): Partial<AbastecimentoEntity> {
    return {
      litros: dto.litros,
      codPagamento: dto.codPagamento,
      precoFinal: dto.precoFinal,
      dataAbastecimento: dto.dataAbastecimento,
      valorUnitarioLitro: dto.valorUnitarioLitro,
      valorMedioLitro: dto.valorMedioLitro,
      valorUnitario: dto.valorUnitario,
      valorMedio: dto.valorMedio,
      justificativaAlteracao: dto.justificativaAlteracao,
      // As relações (idTipoCombustivel e idCorrida) são tratadas separadamente no update
    };
  }
}
