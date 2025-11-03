import { Injectable, NotFoundException } from '@nestjs/common';
import { MultaDto, FindAllParameters } from './multa.dto';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class MultaService {
  constructor(
    @InjectRepository(MultaEntity)
    private readonly MultaRepository: Repository<MultaEntity>,
    private readonly logService: LogService,
  ) {}
  private multa: MultaDto[] = [];

  async create(
    multa: MultaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const multaToSave: MultaEntity = {
      codigoInfracao: multa.codigoInfracao,
      classificacao: multa.classificacao,
      valorInfracao: multa.valorInfracao,
      placaVeiculo: multa.placaVeiculo,
      dataInfracao: multa.dataInfracao,
      autoInfracao: multa.autoInfracao,
    };

    const savedMulta = await this.MultaRepository.save(multaToSave);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: savedMulta.idMulta,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedMulta;
  }

  async findById(idMulta: number): Promise<MultaDto> {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }
    return this.mapEntityToDto(foundMulta);
  }

  async findAll(params: FindAllParameters): Promise<MultaDto[]> {
    const searchParams: FindOptionsWhere<MultaEntity> = {};

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

    const multaFound = await this.MultaRepository.find({
      where: searchParams,
    });

    return multaFound.map((MultaEntity) => this.mapEntityToDto(MultaEntity));
  }

  async softRemove(
    idMulta: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }

    const dadosAntigos = { ...foundMulta };

    foundMulta.deletada = true;

    const updatedMulta = await this.MultaRepository.save(foundMulta);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: idMulta,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async update(
    idMulta: number,
    multa: MultaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${multa.idMulta} not found`);
    }

    const dadosAntigos = { ...foundMulta };

    const updateData = this.mapDtoToEntity(multa);
    const mergedEntity = this.MultaRepository.merge(foundMulta, updateData);

    const updatedMulta = await this.MultaRepository.save(mergedEntity);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: idMulta,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(MultaEntity: MultaEntity): MultaDto {
    return {
      idMulta: MultaEntity.idMulta,
      codigoInfracao: MultaEntity.codigoInfracao,
      classificacao: MultaEntity.classificacao,
      valorInfracao: MultaEntity.valorInfracao,
      placaVeiculo: MultaEntity.placaVeiculo,
      dataInfracao: MultaEntity.dataInfracao,
      autoInfracao: MultaEntity.autoInfracao,
      deletada: MultaEntity.deletada,
    };
  }

  private mapDtoToEntity(MultaDto: MultaDto): Partial<MultaEntity> {
    return {
      codigoInfracao: MultaDto.codigoInfracao,
      classificacao: MultaDto.classificacao,
      valorInfracao: MultaDto.valorInfracao,
      placaVeiculo: MultaDto.placaVeiculo,
      dataInfracao: MultaDto.dataInfracao,
      autoInfracao: MultaDto.autoInfracao,
      deletada: MultaDto.deletada,
    };
  }
}
