import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { Equal, FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { CarrosDto, FindAllParameters } from './carros.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class CarrosService {
  constructor(
    @InjectRepository(CarrosEntity)
    private readonly carrosRepository: Repository<CarrosEntity>,

    @InjectRepository(TipoCombustivelEntity)
    private readonly tipoCombustivelRepository: Repository<TipoCombustivelEntity>,

    private readonly logService: LogService,
  ) {}

  async atualizarSituacao(
    idCarro: number,
    situacao: string,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<CarrosDto> {
    const carro = await this.carrosRepository.findOne({ where: { idCarro } });

    if (!carro) {
      throw new NotFoundException(`Carro com id ${idCarro} não encontrado`);
    }

    const dadosAntigos = { ...carro };

    carro.situacao = situacao;

    const carroAtualizado = await this.carrosRepository.save(carro);

    const logData: LogDto = {
      nomeTabela: 'carros',
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
    carro: CarrosDto,
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

    const carrosToSave: Partial<CarrosEntity> = {
      tombo: carro.tombo,
      qrCode: carro.qrCode,
      modelo: carro.modelo,
      placa: carro.placa,
      odometro: carro.odometro,
      ano: carro.ano,
      localidadeFisica: carro.localidadeFisica,
      situacao: carro.situacao,
      ativo: carro.ativo,
      tipo_combustivel: tipoCombustivel,
    };

    const savedCarro = await this.carrosRepository.save(carrosToSave);

    const logData: LogDto = {
      nomeTabela: 'carros',
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

  async findById(idCarro: number): Promise<CarrosDto> {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarro },
      relations: ['tipo_combustivel'],
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    return this.mapEntityToDto(foundCarro);
  }

  async findByPlaca(placa: string): Promise<CarrosDto[]> {
    const carroFound = await this.carrosRepository
      .createQueryBuilder('carro')
      .where('LOWER(carro.placa) LIKE LOWER(:placa)', { placa: `%${placa}%` })
      .getMany();

    if (!carroFound || carroFound.length === 0) {
      return [];
    }

    return carroFound.map((CarrosEntity) => this.mapEntityToDto(CarrosEntity));
  }

  async findByModeloPlaca(modeloPlaca: string): Promise<CarrosDto[]> {
    if (!modeloPlaca || modeloPlaca.trim() === '') {
      return [];
    }

    const searchTerm = `%${modeloPlaca.trim()}%`;

    const carrosFound = await this.carrosRepository.find({
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

    return carrosFound.map((carroEntity) => this.mapEntityToDto(carroEntity));
  }

  async findAll(params: FindAllParameters): Promise<CarrosDto[]> {
    const searchParams: FindOptionsWhere<CarrosEntity> = {};

    if (params.modelo) {
      searchParams.modelo = Like(`%${params.modelo}%`);
    }

    if (params.ano) {
      searchParams.ano = Equal(params.ano);
    }

    const carrosFound = await this.carrosRepository.find({
      where: searchParams,
      relations: ['tipo_combustivel'],
    });

    return carrosFound.map((CarrosEntity) => this.mapEntityToDto(CarrosEntity));
  }

  async update(
    idCarro: number,
    carros: CarrosDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarro },
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${carros.idCarro} not found`);
    }

    const dadosAntigos = { ...foundCarro };

    await this.carrosRepository.update(idCarro, this.mapDtoToentity(carros));

    const updatedCarro = await this.carrosRepository.findOne({
      where: { idCarro },
    });

    const logData: LogDto = {
      nomeTabela: 'carros',
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
    const carroToDelete = await this.carrosRepository.findOne({
      where: { idCarro },
    });

    if (!carroToDelete) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const dadosAntigos = { ...carroToDelete };

    const result = await this.carrosRepository.delete(idCarro);

    if (!result.affected) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'carros',
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
  ): Promise<CarrosDto> {
    const carro = await this.carrosRepository.findOne({ where: { idCarro } });

    if (!carro) {
      throw new NotFoundException(`Item with id ${idCarro} not found`);
    }

    const dadosAntigos = { ...carro };

    carro.ativo = !carro.ativo;

    const carroAtualizado = await this.carrosRepository.save(carro);

    const logData: LogDto = {
      nomeTabela: 'carros',
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

  private mapEntityToDto(CarrosEntity: CarrosEntity): CarrosDto {
    return {
      idCarro: CarrosEntity.idCarro,
      tombo: CarrosEntity.tombo,
      qrCode: CarrosEntity.qrCode,
      placa: CarrosEntity.placa,
      odometro: CarrosEntity.odometro,
      modelo: CarrosEntity.modelo,
      ano: CarrosEntity.ano,
      localidadeFisica: CarrosEntity.localidadeFisica,
      situacao: CarrosEntity.situacao,
      ativo: CarrosEntity.ativo,

      nomeTipoCombustivel: CarrosEntity.tipo_combustivel?.nome,
      idTipoCombustivel: CarrosEntity.tipo_combustivel?.idTipoCombustivel,
    };
  }

  private mapDtoToentity(carrosDto: CarrosDto): Partial<CarrosEntity> {
    return {
      tombo: carrosDto.tombo,
      qrCode: carrosDto.qrCode,
      placa: carrosDto.placa,
      odometro: carrosDto.odometro,
      modelo: carrosDto.modelo,
      ano: carrosDto.ano,
      localidadeFisica: carrosDto.localidadeFisica,
      situacao: carrosDto.situacao,
      ativo: carrosDto.ativo,
    };
  }
}
