import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { MultaDto, FindAllParameters } from './multa.dto';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';
import { CorridaService } from '../corrida/corrida.service';
import { EmailService } from '../email/email.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AnexoService } from '../anexo/anexo.service';

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
    private readonly anexoService: AnexoService,
  ) {}

  private multa: MultaDto[] = [];

  async create(
    multa: MultaDto,
    arquivo?: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<{
    multa: MultaDto;
    mensagem?: string;
    motoristaResponsavel?: {
      idMotorista: number;
      nomeMotorista: string;
    } | null;
  }> {
    let motoristaResponsavel = null;
    let situacao = 'MOTORISTA NAO IDENTIFICADO';
    let mensagem: string | undefined;

    try {
      const corridaEncontrada =
        await this.corridaService.encontrarCorridaPorPlacaEData(
          multa.placaVeiculo,
          multa.dataInfracao,
        );

      if (corridaEncontrada) {
        motoristaResponsavel = {
          idMotorista: corridaEncontrada.idMotorista,
          nomeMotorista:
            corridaEncontrada.nomeMotorista || 'Motorista não identificado',
        };
        situacao = 'ATRIBUIDA';
      } else {
        mensagem =
          'Não foi possível identificar o motorista responsável pela multa.';
      }
    } catch (error) {
      mensagem =
        'Não foi possível identificar o motorista responsável pela multa.';
    }

    let urlArquivo = null;

    if (arquivo) {
      try {
        urlArquivo = await this.anexoService.salvarArquivo(arquivo);
      } catch (error) {}
    }

    const multaToSave: MultaEntity = {
      codigoInfracao: multa.codigoInfracao,
      classificacao: multa.classificacao,
      valorInfracao: multa.valorInfracao,
      placaVeiculo: multa.placaVeiculo,
      dataInfracao: multa.dataInfracao,
      autoInfracao: multa.autoInfracao,
      situacao: situacao,
      urlArquivo: urlArquivo,
      idMotorista: motoristaResponsavel
        ? motoristaResponsavel.idMotorista
        : null,
      ativa: true,
    } as MultaEntity;

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
            },
          );
        }
      } catch (emailError) {}
    }

    const dto = this.mapEntityToDto(savedMulta);

    return {
      multa: dto,
      mensagem,
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

  // MultaService
  async findByAno(ano: number): Promise<MultaEntity[]> {
    return await this.MultaRepository.createQueryBuilder('m')
      .leftJoinAndSelect('m.motorista', 'motorista')
      .where("date_trunc('year', m.dataInfracao) = :ano", {
        ano: `${ano}-01-01`,
      })
      .andWhere('m.ativa = :ativa', { ativa: true })
      .orderBy('m.dataInfracao', 'DESC')
      .getMany();
  }

  /** Agrupa multas por propriedade e retorna array formatado */
  async groupByClassificacao(
    multas: MultaEntity[],
    prop: 'classificacao' | 'placaVeiculo',
    defaultValue: string = 'Não especificado',
  ) {
    const map: Record<string, number> = {};
    for (const m of multas) {
      const key = m[prop] || defaultValue;
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map).map(([key, quantidade]) => ({
      [prop]: key,
      quantidade,
    }));
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

    foundMulta.ativa = false;

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
      throw new NotFoundException(`Item with id ${idMulta} not found`);
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

  async atualizarArquivo(
    idMulta: number,
    arquivo: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Multa com id ${idMulta} não encontrada`);
    }

    const dadosAntigos = { ...foundMulta };

    const urlArquivo = await this.anexoService.salvarArquivo(arquivo);

    foundMulta.urlArquivo = urlArquivo;

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

  async removerArquivo(
    idMulta: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Multa com id ${idMulta} não encontrada`);
    }

    if (!foundMulta.urlArquivo) {
      return;
    }

    const dadosAntigos = { ...foundMulta };

    const urlArquivoParaDeletar = foundMulta.urlArquivo;

    foundMulta.urlArquivo = null;
    const updatedMulta = await this.MultaRepository.save(foundMulta);

    try {
      await this.anexoService.deletarArquivoPorUrl(urlArquivoParaDeletar);
    } catch (error) {
      console.error(
        'Erro ao deletar arquivo físico, mas multa foi atualizada:',
        error,
      );
    }

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

  async atualizarComprovantePagamento(
    idMulta: number,
    arquivo: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundMulta = await this.MultaRepository.findOne({
      where: { idMulta },
    });

    if (!foundMulta) {
      throw new NotFoundException(`Multa com id ${idMulta} não encontrada`);
    }

    const dadosAntigos = { ...foundMulta };

    const url = await this.anexoService.salvarArquivo(arquivo);

    foundMulta.urlComprovantePagamento = url;

    const updatedMulta = await this.MultaRepository.save(foundMulta);

    await this.logService.logChange({
      nomeTabela: 'multa',
      idRegistro: idMulta,
      operacao: 'UPDATE',
      dadosAntigos,
      dadosNovos: updatedMulta,
      idUsuario: currentUserId,
      usuario: currentUserName,
    });
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
      situacao: MultaEntity.situacao,
      ativa: MultaEntity.ativa,
      urlArquivo: MultaEntity.urlArquivo,
      urlComprovantePagamento: MultaEntity.urlComprovantePagamento,
      idMotorista: MultaEntity.idMotorista,
      nomeMotorista: MultaEntity.motorista?.nome,
      motorista: MultaEntity.motorista
        ? {
            idUsuario: MultaEntity.motorista.idUsuario,
            nome: MultaEntity.motorista.nome,
            email: MultaEntity.motorista.email,
          }
        : undefined,
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
      situacao: MultaDto.situacao,
      ativa: MultaDto.ativa,
      urlComprovantePagamento: MultaDto.urlComprovantePagamento,
    };
  }
}
