import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { OcorrenciaEntity } from 'src/db/entities/ocorrencia.entity';
import { FindAllParameters, ocorrenciaDto } from './ocorrencia.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class ocorrenciaService {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    private readonly logService: LogService,
  ) {}

  async create(
    ocorrencia: ocorrenciaDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<OcorrenciaEntity> {
    const entity = new OcorrenciaEntity();
    entity.descricao = ocorrencia.descricao;
    entity.idCorrida = ocorrencia.idCorrida;
    entity.dataOcorrencia = ocorrencia.dataOcorrencia;

    const savedOcorrencia = await this.ocorrenciaRepository.save(entity);

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: savedOcorrencia.idOcorrencia,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedOcorrencia;
  }

  async findById(idOcorrencia: number): Promise<ocorrenciaDto> {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }
    return this.mapEntityToDto(foundOcorrencia);
  }

  async findByIdCorrida(idCorrida: number): Promise<ocorrenciaDto[]> {
    const foundocorrencia = await this.ocorrenciaRepository.find({
      where: { idCorrida },
    });

    if (!foundocorrencia || foundocorrencia.length === 0) {
      return [];
    }

    return foundocorrencia.map((ocorrencia) => this.mapEntityToDto(ocorrencia));
  }

  async findAll(params: FindAllParameters): Promise<ocorrenciaDto[]> {
    const searchParams: FindOptionsWhere<OcorrenciaEntity> = {};

    if (params.descricao) {
      searchParams.descricao = Like(`${params.descricao}%`);
    }

    if (params.idCorrida) {
      searchParams.idCorrida = params.idCorrida;
    }

    const ocorrenciaFound = await this.ocorrenciaRepository.find({
      where: searchParams,
    });

    return ocorrenciaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async update(
    idOcorrencia: number,
    ocorrencia: ocorrenciaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} do not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    await this.ocorrenciaRepository.update(
      idOcorrencia,
      this.mapDtoToEntity(ocorrencia),
    );

    const updatedOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async updateOcorrencia(
    idOcorrencia: number,
    ocorrencia: ocorrenciaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    foundOcorrencia.descricao = ocorrencia.descricao;
    foundOcorrencia.dataOcorrencia = ocorrencia.dataOcorrencia;

    const updatedOcorrencia = await this.ocorrenciaRepository.save(foundOcorrencia);

    // await this.ocorrenciaRepository.update(idOcorrencia, { descricao });

    // const updatedOcorrencia = await this.ocorrenciaRepository.findOne({
    //   where: { idOcorrencia },
    // });

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idOcorrencia: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const ocorrenciaToDelete = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia: idOcorrencia },
    });

    if (!ocorrenciaToDelete) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...ocorrenciaToDelete };

    const result = await this.ocorrenciaRepository.delete(idOcorrencia);

    if (!result.affected) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async softRemove(
    idOcorrencia: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });


    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    foundOcorrencia.ativa = false;

    const updatedOcorrencia = await this.ocorrenciaRepository.save(foundOcorrencia);

    // const logData: LogDto = {
    //   nomeTabela: 'percurso',
    //   idAbastecimento: idAbastecimento,
    //   operacao: 'UPDATE',
    //   dadosAntigos: dadosAntigos,
    //   dadosNovos: updatedPercurso,
    //   idUsuario: currentUserId,
    //   usuario: currentUserName,
    // };

    // await this.logService.logChange(logData);
  }



  private mapEntityToDto(OcorrenciaEntity: OcorrenciaEntity): ocorrenciaDto {
    return {
      idOcorrencia: OcorrenciaEntity.idOcorrencia,
      descricao: OcorrenciaEntity.descricao,
      idCorrida: OcorrenciaEntity.idCorrida,
      dataOcorrencia: OcorrenciaEntity.dataOcorrencia,
      ativa: OcorrenciaEntity.ativa,
    };
  }

  private mapDtoToEntity(
    ocorrenciaDto: ocorrenciaDto,
  ): Partial<OcorrenciaEntity> {
    return {
      descricao: ocorrenciaDto.descricao,
      idCorrida: ocorrenciaDto.idCorrida,
      dataOcorrencia: ocorrenciaDto.dataOcorrencia,
      ativa: ocorrenciaDto.ativa,
    };
  }
}
