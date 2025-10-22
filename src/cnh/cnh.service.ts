import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, CnhDto } from './cnh.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CnhEntity } from 'src/db/entities/cnh.entity';
import { FindOptionsWhere, Repository, Like } from 'typeorm';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class CnhService {
  constructor(
    @InjectRepository(CnhEntity)
    private readonly cnhRepository: Repository<CnhEntity>,
    private readonly logService: LogService,
  ) {}

  private cnh: CnhDto[] = [];

  async create(
    cnh: CnhDto,
    currentUserId?: number,
    currentUserName?: string
  ) {
    const cnhToSave: CnhEntity = {
      nome: cnh.nome,
      classificacao: cnh.classificacao,
      dataEmissao: cnh.dataEmissao,
      dataValidade: cnh.dataValidade,
    };

    const savedCnh = await this.cnhRepository.save(cnhToSave);

    const logData: LogDto = {
      nomeTabela: 'cnh',
      idRegistro: savedCnh.idCnh,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedCnh,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedCnh;
  }

  async findById(idCnh: number): Promise<CnhDto> {
    const foundCnh = await this.cnhRepository.findOne({
      where: { idCnh },
    });

    if (!foundCnh) {
      throw new NotFoundException(`Item with id ${idCnh} not found`);
    }

    return this.mapEntityToDto(foundCnh);
  }

  async findAll(params: FindAllParameters): Promise<CnhDto[]> {
    const searchParams: FindOptionsWhere<CnhEntity> = {};

    if (params.classificacao) {
      searchParams.classificacao = Like(`%${params.classificacao}%`);
    }

    //implementar data de validade

    const cnhFound = await this.cnhRepository.find({
      where: searchParams,
    });

    return cnhFound.map((CnhEntity) => this.mapEntityToDto(CnhEntity));
  }

  async update(
    idCnh: number,
    cnh: CnhDto,
    currentUserId?: number,
    currentUserName?: string
  ) {
    const foundCnh = await this.cnhRepository.findOne({
      where: { idCnh },
    });

    if (!foundCnh) {
      throw new HttpException(
        `Item with id ${cnh.idCnh} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundCnh };

    await this.cnhRepository.update(idCnh, this.mapDtoToEntity(cnh));

    const updatedCnh = await this.cnhRepository.findOne({
      where: { idCnh },
    });

    const logData: LogDto = {
      nomeTabela: 'cnh',
      idRegistro: idCnh,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedCnh,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idCnh: number,
    currentUserId?: number,
    currentUserName?: string
  ) {
    const cnhToDelete = await this.cnhRepository.findOne({
      where: { idCnh },
    });

    if (!cnhToDelete) {
      throw new HttpException(
        `Item with id ${idCnh} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...cnhToDelete };

    const result = await this.cnhRepository.delete(idCnh);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idCnh} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const logData: LogDto = {
      nomeTabela: 'cnh',
      idRegistro: idCnh,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(CnhEntity: CnhEntity): CnhDto {
    return {
      idCnh: CnhEntity.idCnh,
      nome: CnhEntity.nome,
      classificacao: CnhEntity.classificacao,
      dataEmissao: CnhEntity.dataEmissao,
      dataValidade: CnhEntity.dataValidade,
    };
  }

  private mapDtoToEntity(CnhDto: CnhDto): Partial<CnhEntity> {
    return {
      nome: CnhDto.nome,
      classificacao: CnhDto.classificacao,
      dataEmissao: CnhDto.dataEmissao,
      dataValidade: CnhDto.dataValidade,
    };
  }
}
