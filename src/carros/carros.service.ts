import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { Equal, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CarrosDto, FindAllParameters } from './carros.dto';

@Injectable()
export class CarrosService {
  constructor(
    @InjectRepository(CarrosEntity)
    private readonly carrosRepository: Repository<CarrosEntity>,

    @InjectRepository(TipoCombustivelEntity)
    private readonly tipoCombustivelRepository: Repository<TipoCombustivelEntity>,
  ) {}

  async create(carros: CarrosDto) {
    // Verificar se o tipo de combustível existe
    const tipoCombustivel = await this.tipoCombustivelRepository.findOne({
      where: { id_tipo_combustivel: carros.id_tipo_combustivel },
    });

    if (!tipoCombustivel) {
      throw new NotFoundException(
        `Tipo de combustível com id ${carros.id_tipo_combustivel} não encontrado`,
      );
    }

    const carrosToSave: Partial<CarrosEntity> = {
      tombo: carros.tombo,
      qrCode: carros.qrCode,
      modelo: carros.modelo,
      placa: carros.placa,
      odometro: carros.odometro,
      ano: carros.ano,
      localidade_fisica: carros.localidade_fisica,
      situacao: carros.situacao,
      ativo: carros.ativo,
      tipo_combustivel: tipoCombustivel, // Usar a entidade completa
    };

    return await this.carrosRepository.save(carrosToSave);
  }

  async findById(idCarros: number): Promise<CarrosDto> {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarros },
      relations: ['tipo_combustivel'], // Incluindo a relação com tipo_combustivel
    });

    if (!foundCarro) {
      throw new NotFoundException(`Item with id ${idCarros} not found`);
    }

    return this.mapEntityToDto(foundCarro);
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
    });

    return carrosFound.map((CarrosEntity) => this.mapEntityToDto(CarrosEntity));
  }

  async update(idCarros: number, carros: CarrosDto) {
    const foundCarro = await this.carrosRepository.findOne({
      where: { idCarros },
    });

    if (!foundCarro) {
      throw new HttpException(
        `Item with id ${carros.idCarros} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.carrosRepository.update(idCarros, this.mapDtoToentity(carros));
  }

  async remove(idCarros: number) {
    const result = await this.carrosRepository.delete(idCarros);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idCarros} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ativar carro/inativar carro
  async inativar(idCarros: number): Promise<CarrosDto> {
    const carro = await this.carrosRepository.findOne({ where: { idCarros } });

    if (!carro) {
      throw new NotFoundException(`Carro com ID ${idCarros} não encontrado`);
    }

    carro.ativo = !carro.ativo;

    const carroAtualizado = await this.carrosRepository.save(carro);
    return this.mapEntityToDto(carroAtualizado);
  }

  private mapEntityToDto(CarrosEntity: CarrosEntity): CarrosDto {
    return {
      idCarros: CarrosEntity.idCarros,
      tombo: CarrosEntity.tombo,
      qrCode: CarrosEntity.qrCode,
      placa: CarrosEntity.placa,
      odometro: CarrosEntity.odometro,
      modelo: CarrosEntity.modelo,
      ano: CarrosEntity.ano,
      localidade_fisica: CarrosEntity.localidade_fisica,
      situacao: CarrosEntity.situacao,
      ativo: CarrosEntity.ativo,
      id_tipo_combustivel: CarrosEntity.tipo_combustivel?.id_tipo_combustivel,
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
      localidade_fisica: carrosDto.localidade_fisica,
      situacao: carrosDto.situacao,
      ativo: carrosDto.ativo,
    };
  }
}
