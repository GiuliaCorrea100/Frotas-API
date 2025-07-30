import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CorridaDto, FindAllParameters } from './corrida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { FindOptionsWhere, Repository, Like } from 'typeorm';
//import { UserEntity } from 'src/db/entities/users.entity';

@Injectable()
export class CorridaService {
  constructor(
    @InjectRepository(CorridasEntity)
    private readonly corridaRepository: Repository<CorridasEntity>,
  ) {}

  async create(corrida: CorridaDto): Promise<CorridaDto> {
    // CÂMERA 1: O que o serviço recebeu do controller?
    console.log('--- PASSO 1: DTO recebido no serviço ---');
    console.log(corrida);

    const corridaToSave = this.mapDtoToEntity(corrida);

    // CÂMERA 2: Como ficou o objeto que será salvo no banco?
    console.log('--- PASSO 2: Objeto da Entidade ANTES de salvar ---');
    console.log(corridaToSave);

    const insertResult = await this.corridaRepository.insert(corridaToSave);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newId = insertResult.identifiers[0].idCorrida;

    if (!newId) {
      throw new Error('Falha ao criar a corrida, o ID não foi gerado.');
    }

    const savedEntity = await this.corridaRepository.save(corridaToSave);

    // CÂMERA 3: O que o banco de dados retornou após salvar?
    console.log(
      '--- PASSO 3: Entidade DEPOIS de salvar (retorno do banco) ---',
    );

    return this.findById(newId);

    console.log(savedEntity);

    return this.mapEntityToDto(savedEntity);
  }

  async findById(idCorrida: number): Promise<CorridaDto> {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
      relations: ['motorista', 'carro'],
    });

    if (!foundCorrida) {
      throw new NotFoundException(`Item with id ${idCorrida} not found`);
    }
    return this.mapEntityToDto(foundCorrida);
  }

  async findAll(params: FindAllParameters): Promise<CorridaDto[]> {
    const searchParams: FindOptionsWhere<CorridasEntity> = {};

    if (params.itinerario) {
      searchParams.itinerario = Like(`%${params.itinerario}%`);
    }

    const corridaFound = await this.corridaRepository.find({
      where: searchParams,
      relations: ['motorista', 'carro'],
    });

    return corridaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async update(idCorrida: number, corrida: CorridaDto) {
    const foundCorrida = await this.corridaRepository.findOne({
      where: { idCorrida },
    });

    if (!foundCorrida) {
      throw new HttpException(
        `Item with id ${idCorrida} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.corridaRepository.update(
      idCorrida,
      this.mapDtoToEntity(corrida),
    );
  }

  async remove(idCorrida: number) {
    const result = await this.corridaRepository.delete(idCorrida);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idCorrida} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(corridaEntity: CorridasEntity): CorridaDto {
    return {
      idCorrida: corridaEntity.idCorrida,
      dataInicio: corridaEntity.dataInicio,
      dataTermino: corridaEntity.dataTermino,
      distanciaKm: corridaEntity.distanciaKm,
      itinerario: corridaEntity.itinerario,
      idMotorista: corridaEntity.idMotorista,
      nomeMotorista: corridaEntity.motorista?.nome,
      idCarros: corridaEntity.idCarros,
      placaVeiculo: corridaEntity.carro?.placa,
    };
  }

  private mapDtoToEntity(corridaDto: CorridaDto): Partial<CorridasEntity> {
    return {
      dataInicio: corridaDto.dataInicio,
      dataTermino: corridaDto.dataTermino,
      distanciaKm: corridaDto.distanciaKm,
      itinerario: corridaDto.itinerario,
      idMotorista: corridaDto.idMotorista,
      idCarros: corridaDto.idCarros,
    };
  }
}
