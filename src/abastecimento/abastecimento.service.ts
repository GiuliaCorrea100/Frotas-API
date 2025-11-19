import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbastecimentoEntity } from 'src/db/entities/abastecimento.entity';
import { CorridaEntity } from 'src/db/entities/corrida.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class AbastecimentoService {
  constructor(
    @InjectRepository(AbastecimentoEntity)
    private readonly abastecimentoRepository: Repository<AbastecimentoEntity>,

    @InjectRepository(TipoCombustivelEntity)
    private readonly tipoCombustivelRepository: Repository<TipoCombustivelEntity>,

    @InjectRepository(CorridaEntity)
    private readonly corridaRepository: Repository<CorridaEntity>,

    private readonly logService: LogService,
  ) {}

  async create(
    abastecimento: AbastecimentoDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<AbastecimentoDto> {
    const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
      where: { idTipoCombustivel: abastecimento.idTipoCombustivel },
    });

    if (!tipoCombustivel) {
      throw new NotFoundException(
        `Item with id ${abastecimento.idTipoCombustivel} not found`,
      );
    }

    const corrida = await this.corridaRepository.findOne({
      where: { idCorrida: abastecimento.idCorrida },
    });

    if (!corrida) {
      throw new NotFoundException(
        `Item with id ${abastecimento.idTipoCombustivel} not found`,
      );
    }

    const abastecimentoToSave: AbastecimentoEntity = {
      idTipoCombustivel: abastecimento.idTipoCombustivel,
      idCorrida: corrida,
      codigoPagamento: abastecimento.codigoPagamento,
      dataAbastecimento: abastecimento.dataAbastecimento,
      quantidade: abastecimento.quantidade,
      valorUnitario: abastecimento.valorUnitario,
      valorTotal: abastecimento.valorTotal,
    };

    const savedEntity =
      await this.abastecimentoRepository.save(abastecimentoToSave);

    const logData: LogDto = {
      nomeTabela: 'abastecimento',
      idRegistro: savedEntity.idAbastecimento,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedEntity,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(savedEntity);
  }

  async findById(idAbastecimento: number): Promise<AbastecimentoDto> {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
      relations: ['tipoCombustivel', 'idCorrida'],
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
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
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }
    return foundAbastecimentos.map((entity) => this.mapEntityToDto(entity));
  }

  async findAll(params: FindAllParameters): Promise<AbastecimentoDto[]> {
    const searchParams: FindOptionsWhere<AbastecimentoEntity> = {};

    if (params.dataAbastecimento) {
      searchParams.dataAbastecimento = new Date(params.dataAbastecimento);
    }

    const abastecimentosFound = await this.abastecimentoRepository.find({
      where: searchParams,
      relations: ['tipoCombustivel', 'idCorrida'],
    });

    return abastecimentosFound.map((entity) => this.mapEntityToDto(entity));
  }

  async update(
    idAbastecimento: number,
    abastecimento: AbastecimentoDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    const dadosAntigos = { ...foundAbastecimento };

    const updateData: Partial<AbastecimentoEntity> =
      this.mapDtoToEntity(abastecimento);

    if (abastecimento.idTipoCombustivel !== undefined) {
      const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
        where: { idTipoCombustivel: abastecimento.idTipoCombustivel },
      });

      if (!tipoCombustivel) {
        throw new NotFoundException(
          `Item with id ${abastecimento.idTipoCombustivel} not found`,
        );
      }
      updateData.idTipoCombustivel = abastecimento.idTipoCombustivel;
    }

    if (abastecimento.idCorrida !== undefined) {
      const corrida = await this.corridaRepository.findOne({
        where: { idCorrida: abastecimento.idCorrida },
      });

      if (!corrida) {
        throw new NotFoundException(
          `Item with id ${abastecimento.idCorrida} not found`,
        );
      }
      updateData.idCorrida = corrida;
    }

    await this.abastecimentoRepository.update(idAbastecimento, updateData);

    const updatedAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    const logData: LogDto = {
      nomeTabela: 'abastecimento',
      idRegistro: idAbastecimento,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedAbastecimento,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async updateAbastecimento(
    idAbastecimento: number,
    abastecimento: AbastecimentoDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundAbastecimento = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento: idAbastecimento },
    });

    if (!foundAbastecimento) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    const dadosAntigos = { ...foundAbastecimento };

    foundAbastecimento.quantidade = abastecimento.quantidade;
    foundAbastecimento.valorTotal = abastecimento.valorTotal;
    foundAbastecimento.valorUnitario = abastecimento.valorUnitario;
    foundAbastecimento.dataAbastecimento = abastecimento.dataAbastecimento;
    foundAbastecimento.idTipoCombustivel = abastecimento.idTipoCombustivel;

    const savedAbastecimento =
      await this.abastecimentoRepository.save(foundAbastecimento);

    const logData: LogDto = {
      nomeTabela: 'abastecimento',
      idRegistro: idAbastecimento,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: savedAbastecimento,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedAbastecimento;
  }

  async remove(
    idAbastecimento: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const abastecimentoToDelete = await this.abastecimentoRepository.findOne({
      where: { idAbastecimento },
    });

    if (!abastecimentoToDelete) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    const dadosAntigos = { ...abastecimentoToDelete };

    const result = await this.abastecimentoRepository.delete(idAbastecimento);

    if (!result.affected) {
      throw new NotFoundException(`Item with id ${idAbastecimento} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'abastecimento',
      idRegistro: idAbastecimento,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async ConsumoPorCampus(): Promise<{ campus: string; litrosTotal: number }[]> {
    try {
      const detalhesPorCampus = await this.abastecimentoRepository
        .createQueryBuilder('abastecimento')
        .innerJoin('abastecimento.idCorrida', 'corrida')
        .innerJoin('corrida.carro', 'carro')
        .where('abastecimento.quantidade > 0')
        .groupBy('carro.localidade_fisica')
        .select('carro.localidade_fisica', 'campus')
        .addSelect('SUM(abastecimento.quantidade)', 'litrosTotal')
        .getRawMany();

      return detalhesPorCampus.map((item) => ({
        campus: item.campus || 'Não especificado',
        litrosTotal: parseFloat(item.litrosTotal) || 0,
      }));
    } catch (error) {
      console.error('Erro ao calcular consumo por campus:', error);
      throw new HttpException(
        'Erro ao gerar relatório de consumo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapEntityToDto(entity: AbastecimentoEntity): AbastecimentoDto {
    return {
      idAbastecimento: entity.idAbastecimento,
      quantidade: entity.quantidade,
      codigoPagamento: entity.codigoPagamento,
      valorTotal: entity.valorTotal,
      dataAbastecimento: entity.dataAbastecimento,
      valorUnitario: entity.valorUnitario,
      idTipoCombustivel: entity.idTipoCombustivel,
      nomeTipoCombustivel: entity.tipoCombustivel?.nome ?? null,
      idCorrida: entity.idCorrida?.idCorrida,
    };
  }

  private mapDtoToEntity(dto: AbastecimentoDto): Partial<AbastecimentoEntity> {
    return {
      quantidade: dto.quantidade,
      codigoPagamento: dto.codigoPagamento,
      valorTotal: dto.valorTotal,
      dataAbastecimento: dto.dataAbastecimento,
      valorUnitario: dto.valorUnitario,
      
    };
  }
}
