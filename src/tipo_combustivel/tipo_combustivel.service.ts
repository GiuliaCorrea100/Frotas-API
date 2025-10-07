import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { Repository } from 'typeorm';
import { TipoCombustivelDto } from './tipo_combustivel.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class TipoCombustivelService {
  constructor(
    @InjectRepository(TipoCombustivelEntity)
    private readonly repository: Repository<TipoCombustivelEntity>,
    private readonly logService: LogService,
  ) {}

  async create(
    dto: TipoCombustivelDto,
    currentUserId?: number,
    currentUserName?: string
  ): Promise<TipoCombustivelEntity> {

    console.log('Dados do usuário no CREATE:', { currentUserId, currentUserName });
    
    const tipo = this.repository.create(dto);
    const savedTipo = await this.repository.save(tipo);

    const logData: LogDto = {
      nomeTabela: 'tipo_combustivel',
      idRegistro: savedTipo.id_tipo_combustivel,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedTipo,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    console.log('Dados do log (CREATE):', logData);

    await this.logService.logChange(logData);

    return savedTipo;
  }

  async findAll(): Promise<TipoCombustivelEntity[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<TipoCombustivelEntity> {
    const tipo = await this.repository.findOne({
      where: { id_tipo_combustivel: id },
    });
    if (!tipo) {
      throw new NotFoundException('Tipo de combustível não encontrado');
    }
    return tipo;
  }

  async update(
    id: number,
    dto: TipoCombustivelDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<TipoCombustivelEntity> {
    
    console.log('Dados do usuário no UPDATE:', { currentUserId, currentUserName });
    
    const tipo = await this.findOne(id);
    
    const dadosAntigos = { ...tipo };
    
    const updated = this.repository.merge(tipo, dto);
    const savedTipo = await this.repository.save(updated);

    const logData: LogDto = {
      nomeTabela: 'tipo_combustivel',
      idRegistro: id,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: savedTipo,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    console.log('Dados do log (UPDATE):', logData);

    await this.logService.logChange(logData);

    return savedTipo;
  }

  async remove(
    id: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    
    console.log('Dados do usuário no REMOVE:', { currentUserId, currentUserName });
    
    const tipo = await this.findOne(id);
    
    const dadosAntigos = { ...tipo };
    
    await this.repository.remove(tipo);

    const logData: LogDto = {
      nomeTabela: 'tipo_combustivel',
      idRegistro: id,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    console.log('Dados do log (REMOVE):', logData);

    await this.logService.logChange(logData);
  }
}
