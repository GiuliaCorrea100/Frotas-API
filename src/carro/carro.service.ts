import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarroEntity } from 'src/db/entities/carro.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { Equal, FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { CarroDto, FindAllParameters } from './carro.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class carroService {
  constructor(
    @InjectRepository(CarroEntity)
    private readonly carroRepository: Repository<CarroEntity>,

    @InjectRepository(TipoCombustivelEntity)
    private readonly tipoCombustivelRepository: Repository<TipoCombustivelEntity>,

    private readonly logService: LogService,
  ) {}

  async atualizarSituacao(
    idCarro: number,
    situacao: string,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<CarroDto> {
    const carro = await this.carroRepository.findOne({ where: { idCarro } });

    if (!carro) {
      throw new NotFoundException(`Carro com id ${idCarro} não encontrado`);
    }

    const dadosAntigos = { ...carro };

    carro.situacao = situacao;

    const carroAtualizado = await this.carroRepository.save(carro);

    const logData: LogDto = {
      nomeTabela: 'carro',
      idRegistro: idCarro,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: carroAtualizado,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(carroAtualizado);
  }

  async create(
    carro: CarroDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
      where: { idTipoCombustivel: carro.idTipoCombustivel },
    });

    if (!tipoCombustivel) {
      throw new NotFoundException(
        `Item with id ${carro.idTipoCombustivel} not found`,
      );
    }

    const carroToSave: Partial<CarroEntity> = {
      tombo: carro.tombo,
      modelo: carro.modelo,
      placa: carro.placa,
      odometro: carro.odometro,
      ano: carro.ano,
      localidadeFisica: carro.localidadeFisica,
      situacao: carro.situacao,
      ativo: carro.ativo,
      tipo_combustivel: tipoCombustivel,
    };

    const savedCarro = await this.carroRepository.save(carroToSave);

    const logData: LogDto = {
      nomeTabela: 'carro',
      idRegistro: savedCarro.idCarro,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedCarro,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedCarro;
  }

  async findById(idCarro: number): Promise<CarroDto> {
    const foundCarro = await this.carroRepository.findOne({
      where: { idCarro },
      relations: ['tipo_combustivel'],
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    return this.mapEntityToDto(foundCarro);
  }

  async findByPlaca(placa: string): Promise<CarroDto[]> {
    const carroFound = await this.carroRepository
      .createQueryBuilder('carro')
      .where('LOWER(carro.placa) LIKE LOWER(:placa)', { placa: `%${placa}%` })
      .getMany();

    if (!carroFound || carroFound.length === 0) {
      return [];
    }

    return carroFound.map((CarroEntity) => this.mapEntityToDto(CarroEntity));
  }

  async findByModeloPlaca(modeloPlaca: string): Promise<CarroDto[]> {
    if (!modeloPlaca || modeloPlaca.trim() === '') {
      return [];
    }

    const searchTerm = `%${modeloPlaca.trim()}%`;

    const carroFound = await this.carroRepository.find({
      where: [
        {
          situacao: 'DISPONIVEL',
          ativo: true,
          modelo: ILike(searchTerm),
        },
        {
          situacao: 'DISPONIVEL',
          ativo: true,
          placa: ILike(searchTerm),
        },
      ],
      order: {
        modelo: 'ASC',
      },
      take: 10,
    });

    return carroFound.map((carroEntity) => this.mapEntityToDto(carroEntity));
  }

  async findAll(params: FindAllParameters): Promise<CarroDto[]> {
    const searchParams: FindOptionsWhere<CarroEntity> = {};

    if (params.modelo) {
      searchParams.modelo = Like(`%${params.modelo}%`);
    }

    if (params.ano) {
      searchParams.ano = Equal(params.ano);
    }

    const carroFound = await this.carroRepository.find({
      where: searchParams,
      relations: ['tipo_combustivel'],
    });

    return carroFound.map((CarroEntity) => this.mapEntityToDto(CarroEntity));
  }

  async update(
    idCarro: number,
    carro: CarroDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundCarro = await this.carroRepository.findOne({
      where: { idCarro },
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${carro.idCarro} not found`);
    }

    const dadosAntigos = { ...foundCarro };
    await this.carroRepository.update(idCarro, this.mapDtoToentity(carro));

    const updatedCarro = await this.carroRepository.findOne({
      where: { idCarro },
    });

    const logData: LogDto = {
      nomeTabela: 'carro',
      idRegistro: idCarro,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedCarro,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idCarro: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const carroToDelete = await this.carroRepository.findOne({
      where: { idCarro },
    });

    if (!carroToDelete) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const dadosAntigos = { ...carroToDelete };

    const result = await this.carroRepository.delete(idCarro);

    if (!result.affected) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'carro',
      idRegistro: idCarro,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async inativar(
    idCarro: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<CarroDto> {
    const carro = await this.carroRepository.findOne({ where: { idCarro } });

    if (!carro) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const dadosAntigos = { ...carro };

    carro.ativo = !carro.ativo;

    const carroAtualizado = await this.carroRepository.save(carro);

    const logData: LogDto = {
      nomeTabela: 'carro',
      idRegistro: idCarro,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: carroAtualizado,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return this.mapEntityToDto(carroAtualizado);
  }

  private mapEntityToDto(CarroEntity: CarroEntity): CarroDto {
    return {
      idCarro: CarroEntity.idCarro,
      tombo: CarroEntity.tombo,
      placa: CarroEntity.placa,
      odometro: CarroEntity.odometro,
      modelo: CarroEntity.modelo,
      ano: CarroEntity.ano,
      localidadeFisica: CarroEntity.localidadeFisica,
      situacao: CarroEntity.situacao,
      ativo: CarroEntity.ativo,

      nomeTipoCombustivel: CarroEntity.tipo_combustivel?.nome,
      idTipoCombustivel: CarroEntity.idTipoCombustivel,
    };
  }

  private mapDtoToentity(CarroDto: CarroDto): Partial<CarroEntity> {
    return {
      tombo: CarroDto.tombo,
      placa: CarroDto.placa,
      odometro: CarroDto.odometro,
      modelo: CarroDto.modelo,
      ano: CarroDto.ano,
      localidadeFisica: CarroDto.localidadeFisica,
      situacao: CarroDto.situacao,
      ativo: CarroDto.ativo,
      idTipoCombustivel: CarroDto.idTipoCombustivel,
    };
  }
}
