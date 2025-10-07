import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { OcorrenciasEntity } from 'src/db/entities/ocorrencias.entity';
import { FindAllParameters, OcorrenciasDto } from './ocorrencias.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(OcorrenciasEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciasEntity>,
    private readonly logService: LogService,
  ) {}

  async create(
    ocorrencia: OcorrenciasDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<OcorrenciasEntity> {
    const entity = new OcorrenciasEntity();
    entity.descricao = ocorrencia.descricao;
    entity.idCorrida = ocorrencia.idCorrida;
    entity.dataRegistro = ocorrencia.dataRegistro;

    const savedOcorrencia = await this.ocorrenciaRepository.save(entity);

    const logData: LogDto = {
      nomeTabela: 'ocorrencias',
      idRegistro: savedOcorrencia.idOcorrencias,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    console.log('Dados do log (ocorrencias):', {
      currentUserId,
      currentUserName,
      idRegistro: savedOcorrencia.idOcorrencias,
    });

    await this.logService.logChange(logData);

    return savedOcorrencia;
  }

  async findById(idOcorrencias: number): Promise<OcorrenciasDto> {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencias} not found`);
    }
    return this.mapEntityToDto(foundOcorrencia);
  }

  async findByIdCorrida(idCorrida: number): Promise<OcorrenciasDto[]> {
    const foundOcorrencias = await this.ocorrenciaRepository.find({
      where: { idCorrida },
    });

    if (!foundOcorrencias || foundOcorrencias.length === 0) {
      return [];
    }

    return foundOcorrencias.map((ocorrencia) =>
      this.mapEntityToDto(ocorrencia),
    );
  }

  async findAll(params: FindAllParameters): Promise<OcorrenciasDto[]> {
    const searchParams: FindOptionsWhere<OcorrenciasEntity> = {};

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
    idOcorrencias: number,
    ocorrencia: OcorrenciasDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    if (!foundOcorrencia) {
      throw new HttpException(
        `Item with id ${idOcorrencias} do not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundOcorrencia };

    await this.ocorrenciaRepository.update(
      idOcorrencias,
      this.mapDtoToEntity(ocorrencia),
    );

    const updatedOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    const logData: LogDto = {
      nomeTabela: 'ocorrencias',
      idRegistro: idOcorrencias,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async updateDescricao(
    idOcorrencias: number,
    descricao: string,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    if (!foundOcorrencia) {
      throw new HttpException(
        `Item with id ${idOcorrencias} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundOcorrencia };

    await this.ocorrenciaRepository.update(idOcorrencias, { descricao });

    const updatedOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    const logData: LogDto = {
      nomeTabela: 'ocorrencias',
      idRegistro: idOcorrencias,
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
      where: { idOcorrencias: idOcorrencia },
    });

    if (!ocorrenciaToDelete) {
      throw new HttpException(
        `Item with id ${idOcorrencia} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...ocorrenciaToDelete };

    const result = await this.ocorrenciaRepository.delete(idOcorrencia);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idOcorrencia} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const logData: LogDto = {
      nomeTabela: 'ocorrencias',
      idRegistro: idOcorrencia,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(OcorrenciasEntity: OcorrenciasEntity): OcorrenciasDto {
    return {
      idOcorrencia: OcorrenciasEntity.idOcorrencias,
      descricao: OcorrenciasEntity.descricao,
      idCorrida: OcorrenciasEntity.idCorrida,
      dataRegistro: OcorrenciasEntity.dataRegistro,
    };
  }

  private mapDtoToEntity(
    ocorrenciasDto: OcorrenciasDto,
  ): Partial<OcorrenciasEntity> {
    return {
      descricao: ocorrenciasDto.descricao,
      idCorrida: ocorrenciasDto.idCorrida,
      dataRegistro: ocorrenciasDto.dataRegistro,
    };
  }
}
