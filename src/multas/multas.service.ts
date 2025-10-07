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
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class MultasService {
  constructor(
    @InjectRepository(MultasEntity)
    private readonly MultasRepository: Repository<MultasEntity>,
    private readonly logService: LogService,
  ) {}
  private multas: MultasDto[] = [];

  async create(
    multas: MultasDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const multasToSave: MultasEntity = {
      codInfracao: multas.codInfracao,
      classInfracao: multas.classInfracao,
      valor: multas.valor,
      placaVeiculo: multas.placaVeiculo,
      data: multas.data,
      numAutoInfracao: multas.numAutoInfracao,
    };

    const savedMulta = await this.MultasRepository.save(multasToSave);

    const logData: LogDto = {
      nomeTabela: 'multas',
      idRegistro: savedMulta.idMultas,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedMulta;
  }

  async findById(idMultas: number): Promise<MultasDto> {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMultas} not found`);
    }
    return this.mapEntityToDto(foundMulta);
  }

  async findAll(params: FindAllParameters): Promise<MultasDto[]> {
    const searchParams: FindOptionsWhere<MultasEntity> = {};

    if (params.classInfracao) {
      searchParams.classInfracao = Like(`%${params.classInfracao}%`);
    }

    if (params.codInfracao) {
      searchParams.codInfracao = Like(`%${params.codInfracao}%`);
    }

    if (params.placaVeiculo) {
      searchParams.placaVeiculo = Like(`%${params.placaVeiculo}%`);
    }

    const multasFound = await this.MultasRepository.find({
      where: searchParams,
    });

    return multasFound.map((MultasEntity) => this.mapEntityToDto(MultasEntity));
  }

  async update(
    idMultas: number,
    multas: MultasDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!foundMulta) {
      throw new HttpException(
        `Item with id ${idMultas} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    const dadosAntigos = { ...foundMulta };

    const updateData = this.mapDtoToEntity(multas);
    const mergedEntity = this.MultasRepository.merge(foundMulta, updateData);

    const updatedMulta = await this.MultasRepository.save(mergedEntity);

    const logData: LogDto = {
      nomeTabela: 'multas',
      idRegistro: idMultas,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idMultas: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const multaToDelete = await this.MultasRepository.findOne({
      where: { idMultas },
    });

    if (!multaToDelete) {
      throw new HttpException(
        `Item with id ${idMultas} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    const dadosAntigos = { ...multaToDelete };

    const result = await this.MultasRepository.delete(idMultas);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idMultas} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    
    const logData: LogDto = {
      nomeTabela: 'multas',
      idRegistro: idMultas,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(MultasEntity: MultasEntity): MultasDto {
    return {
      idMultas: MultasEntity.idMultas,
      codInfracao: MultasEntity.codInfracao,
      classInfracao: MultasEntity.classInfracao,
      valor: MultasEntity.valor,
      placaVeiculo: MultasEntity.placaVeiculo,
      data: MultasEntity.data,
      numAutoInfracao: MultasEntity.numAutoInfracao,
    };
  }

  private mapDtoToEntity(MultasDto: MultasDto): Partial<MultasEntity> {
    return {
      codInfracao: MultasDto.codInfracao,
      classInfracao: MultasDto.classInfracao,
      valor: MultasDto.valor,
      placaVeiculo: MultasDto.placaVeiculo,
      data: MultasDto.data,
      numAutoInfracao: MultasDto.numAutoInfracao,
    };
  }
}
