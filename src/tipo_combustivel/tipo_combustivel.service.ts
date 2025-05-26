import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { TipoCombustivelDto } from './tipo_combustivel.dto';

@Injectable()
export class TipoCombustivelService {
  constructor(
    @InjectRepository(TipoCombustivelEntity)
    private readonly repository: Repository<TipoCombustivelEntity>,
  ) {}

  async create(dto: TipoCombustivelDto): Promise<TipoCombustivelEntity> {
    const tipo = this.repository.create(dto);
    return await this.repository.save(tipo);
  }

  async findAll(): Promise<TipoCombustivelEntity[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<TipoCombustivelEntity> {
    const tipo = await this.repository.findOne({
      where: { tipo_combustivel_id: id },
    });
    if (!tipo) {
      throw new NotFoundException('Tipo de combustível não encontrado');
    }
    return tipo;
  }

  async update(id: number, dto: TipoCombustivelDto): Promise<TipoCombustivelEntity> {
    const tipo = await this.findOne(id);
    const updated = this.repository.merge(tipo, dto);
    return await this.repository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const tipo = await this.findOne(id);
    await this.repository.remove(tipo);
  }
}
