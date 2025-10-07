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

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(OcorrenciasEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciasEntity>,
  ) {}

  async create(ocorrencia: OcorrenciasDto): Promise<OcorrenciasEntity> {
    const entity = new OcorrenciasEntity();
    entity.descricao = ocorrencia.descricao;
    entity.idCorrida = ocorrencia.idCorrida;
    entity.dataRegistro = ocorrencia.dataRegistro;
    return await this.ocorrenciaRepository.save(entity);
  }

  async findById(idOcorrencias: number): Promise<OcorrenciasDto> {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
      //relations: ['motorista', 'carro'],
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

    if (!foundOcorrencias) {
      throw new NotFoundException(
        `Nenhuma ocorrência encontrada para corrida ${idCorrida}`,
      );
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

  async update(idOcorrencias: number, ocorrencia: OcorrenciasDto) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    if (!foundOcorrencia) {
      throw new HttpException(
        `Item with id ${idOcorrencias} do not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.ocorrenciaRepository.update(
      idOcorrencias,
      this.mapDtoToEntity(ocorrencia),
    );
  }

  async updateDescricao(idOcorrencias: number, descricao: string) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencias },
    });

    if (!foundOcorrencia) {
      throw new HttpException(
        `Item with id ${idOcorrencias} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Atualiza apenas o campo descricao
    await this.ocorrenciaRepository.update(idOcorrencias, { descricao });
  }

  async remove(idOcorrencia: number) {
    const result = await this.ocorrenciaRepository.delete(idOcorrencia);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idOcorrencia} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
