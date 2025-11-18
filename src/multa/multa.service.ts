import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { MultaDto, FindAllParameters } from './multa.dto';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';
import { CorridaService } from '../corrida/corrida.service';
import { EmailService } from '../email/email.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class MultaService {
  constructor(
    @InjectRepository(MultaEntity)
    private readonly MultaRepository: Repository<MultaEntity>,
    private readonly logService: LogService,
    @Inject(forwardRef(() => CorridaService))
    private readonly corridaService: CorridaService,
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,
  ) {}
  private multa: MultaDto[] = [];

  async create(
    multa: MultaDto,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<{
    multa: MultaDto;
    motoristaResponsavel?: {
      idMotorista: number;
      nomeMotorista: string;
    } | null;
  }> {
    let motoristaResponsavel = null;

    try {
      const corridaEncontrada =
        await this.corridaService.encontrarMotoristaPorPlacaEData(
          multa.placaVeiculo,
          multa.dataInfracao,
        );

      if (corridaEncontrada) {
        motoristaResponsavel = {
          idMotorista: corridaEncontrada.idMotorista,
          nomeMotorista:
            corridaEncontrada.nomeMotorista || 'Motorista não identificado',
        };
      }
    } catch (error) {
      console.warn('Não foi possível associar motorista à multa:', error);
    }

    const multaToSave: MultaEntity = {
      codigoInfracao: multa.codigoInfracao,
      classificacao: multa.classificacao,
      valorInfracao: multa.valorInfracao,
      placaVeiculo: multa.placaVeiculo,
      dataInfracao: multa.dataInfracao,
      autoInfracao: multa.autoInfracao,
      deletada: false,
      idMotorista: motoristaResponsavel
        ? motoristaResponsavel.idMotorista
        : null,
    };

    const savedMulta = await this.MultaRepository.save(multaToSave);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: savedMulta.idMulta,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    if (motoristaResponsavel && motoristaResponsavel.idMotorista) {
      try {
        const motorista = (await this.usuarioService.findById(
          motoristaResponsavel.idMotorista,
        )) as any;

        if (motorista && motorista.email) {
          await this.emailService.sendMail(
            motorista.email,
            'Notificação de Multa',
            'notificarMulta.hbs',
            {
              nome: motorista.nome,
              placa: multa.placaVeiculo,
              data: new Date(multa.dataInfracao).toLocaleDateString('pt-BR'),
              descricao: multa.classificacao,
            }
          );
        } else {
          console.log('Usuário sem email cadastrado, não será enviado');
        }
      } catch (emailError) {
        console.warn('Erro ao tentar enviar email da multa:', emailError);
      }
    }

    const dto = this.mapEntityToDto(savedMulta);
    if (motoristaResponsavel) {
      dto.idMotorista = motoristaResponsavel.idMotorista;
      dto.nomeMotorista = motoristaResponsavel.nomeMotorista;
    }

    return {
      multa: dto,
      motoristaResponsavel,
    };
  }

  async findById(idMulta: number): Promise<MultaDto> {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
      relations: ['motorista'],
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }
    return this.mapEntityToDto(foundMulta);
  }

  async findAll(params: FindAllParameters): Promise<MultaDto[]> {
    const searchParams: FindOptionsWhere<MultaEntity> = {};

    if (params.classificacao) {
      searchParams.classificacao = Like(`%${params.classificacao}%`);
    }

    if (params.codigoInfracao) {
      searchParams.codigoInfracao = params.codigoInfracao;
    }

    if (params.placaVeiculo) {
      searchParams.placaVeiculo = Like(`%${params.placaVeiculo}%`);
    }

    if (params.valorInfracao) {
      searchParams.valorInfracao = params.valorInfracao;
    }

    if (params.dataInfracao) {
      searchParams.dataInfracao = params.dataInfracao;
    }

    const multaFound = await this.MultaRepository.find({
      where: searchParams,
      relations: ['motorista'],
    });

    return multaFound.map((MultaEntity) => this.mapEntityToDto(MultaEntity));
  }

  async softRemove(
    idMulta: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }

    const dadosAntigos = { ...foundMulta };

    foundMulta.deletada = true;

    const updatedMulta = await this.MultaRepository.save(foundMulta);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: idMulta,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async update(
    idMulta: number,
    multa: MultaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${multa.idMulta} not found`);
    }

    const dadosAntigos = { ...foundMulta };

    const updateData = this.mapDtoToEntity(multa);
    const mergedEntity = this.MultaRepository.merge(foundMulta, updateData);

    const updatedMulta = await this.MultaRepository.save(mergedEntity);

    const logData: LogDto = {
      nomeTabela: 'multa',
      idRegistro: idMulta,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(MultaEntity: MultaEntity): MultaDto {
    return {
      idMulta: MultaEntity.idMulta,
      codigoInfracao: MultaEntity.codigoInfracao,
      classificacao: MultaEntity.classificacao,
      valorInfracao: MultaEntity.valorInfracao,
      placaVeiculo: MultaEntity.placaVeiculo,
      dataInfracao: MultaEntity.dataInfracao,
      autoInfracao: MultaEntity.autoInfracao,
      deletada: MultaEntity.deletada,
      idMotorista: MultaEntity.idMotorista,
      nomeMotorista: MultaEntity.motorista?.nome,
    };
  }

  private mapDtoToEntity(MultaDto: MultaDto): Partial<MultaEntity> {
    return {
      codigoInfracao: MultaDto.codigoInfracao,
      classificacao: MultaDto.classificacao,
      valorInfracao: MultaDto.valorInfracao,
      placaVeiculo: MultaDto.placaVeiculo,
      dataInfracao: MultaDto.dataInfracao,
      autoInfracao: MultaDto.autoInfracao,
      deletada: MultaDto.deletada,
      idMotorista: MultaDto.idMotorista ?? null,
    };
  }
}
