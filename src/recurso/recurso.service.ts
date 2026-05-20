import { Injectable, NotFoundException } from '@nestjs/common';
import { recursoDto } from './recurso.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoEntity } from 'src/db/entities/recurso.entity';
import { AnexoService } from 'src/anexo/anexo.service';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { EmailService } from 'src/email/email.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class RecursoService {
  constructor(
    @InjectRepository(RecursoEntity)
    private readonly recursoRepository: Repository<RecursoEntity>,

    @InjectRepository(MultaEntity)
    private readonly multaRepository: Repository<MultaEntity>,
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,

    private readonly logServices: LogService,
    private readonly anexoService: AnexoService,
  ) {}

  async create(
    recurso: recursoDto,
    arquivo?: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<RecursoEntity> {
    let urlArquivo = null;

    if (arquivo) {
      try {
        urlArquivo = await this.anexoService.salvarArquivo(
          arquivo,
          'recursos',
          recurso.idMulta,
          'recurso',
        );
      } catch (error) {
        console.error('Error saving file:', error);
      }
    }

    const entity = new RecursoEntity();
    entity.justificativa = recurso.justificativa;
    entity.idMulta = recurso.idMulta;
    entity.urlArquivo = urlArquivo;

    const savedRecurso = await this.recursoRepository.save(entity);

    const idMulta = recurso.idMulta;

    const foundMulta = await this.multaRepository.findOne({
      where: { idMulta },
      relations: ['motorista'],
    });

    if (!foundMulta) {
      throw new NotFoundException(`Item with id ${idMulta} not found`);
    }

    foundMulta.situacao = 'RECURSO SOLICITADO';

    await this.multaRepository.save(foundMulta);

    const logDataRecurso: LogDto = {
      nomeTabela: 'recurso',
      idRegistro: savedRecurso.idRecurso,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedRecurso,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    const administrators = await this.usuarioService.findAll({
      administrador: true,
    });
    const motorista = await this.usuarioService.findById(currentUserId);

    for (const admin of administrators) {
      await this.emailService.sendMail(
        admin.email,
        'Solicitação de Recurso de Multa',
        'notificarSolicitarRecurso.hbs',
        {
          nome: admin.nome,
          motorista: motorista.nome,
          multa: idMulta,
          justificativa: recurso.justificativa,
        },
      );
    }

    await this.logServices.logChange(logDataRecurso);

    return savedRecurso;
  }

  async findByMulta(idMulta: number): Promise<RecursoEntity | null> {
    return this.recursoRepository.findOne({
      where: { idMulta },
    });
  }

  async aceitarRecurso(
    idMulta: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const multa = await this.multaRepository.findOne({
      where: { idMulta },
      relations: ['motorista'],
    });

    if (!multa) {
      throw new NotFoundException(`Multa ${idMulta} não encontrada`);
    }

    const dadosAntigos = { ...multa };

    multa.situacao = 'RECURSO ACEITO - MULTA ANULADA';

    const multaAtualizada = await this.multaRepository.save(multa);

    await this.logServices.logChange({
      nomeTabela: 'multa',
      idRegistro: multa.idMulta,
      operacao: 'UPDATE',
      dadosAntigos,
      dadosNovos: multaAtualizada,
      idUsuario: currentUserId,
      usuario: currentUserName,
    });

    try {
      if (multa.motorista && multa.motorista.email) {
        await this.emailService.sendMail(
          multa.motorista.email,
          'Recurso de Multa Aceito',
          'recursoAceito.hbs',
          {
            nome: multa.motorista.nome,
            placa: multa.placaVeiculo,
            dataMulta: new Date(multa.dataInfracao).toLocaleDateString('pt-BR'),
          },
        );
      }
    } catch (error) {
      console.error('Erro ao enviar email de aceite de recurso:', error);
    }

    return multaAtualizada;
  }

  async rejeitarRecurso(
    idMulta: number,
    justificativaRejeicao: string,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<RecursoEntity> {
    const recurso = await this.recursoRepository.findOne({
      where: { idMulta },
    });

    if (!recurso) {
      throw new NotFoundException(`Recurso da multa ${idMulta} não encontrado`);
    }

    recurso.justificativaRejeicao = justificativaRejeicao;
    const recursoAtualizado = await this.recursoRepository.save(recurso);

    const multa = await this.multaRepository.findOne({
      where: { idMulta },
      relations: ['motorista'],
    });

    if (multa) {
      multa.situacao = 'RECURSO NEGADO - AGUARDANDO PAGAMENTO';
      await this.multaRepository.save(multa);

      try {
        if (multa.motorista && multa.motorista.email) {
          await this.emailService.sendMail(
            multa.motorista.email,
            'Recurso de Multa Rejeitado',
            'recursoRejeitado.hbs',
            {
              nome: multa.motorista.nome,
              placa: multa.placaVeiculo,
              dataMulta: new Date(multa.dataInfracao).toLocaleDateString(
                'pt-BR',
              ),
              motivo: justificativaRejeicao,
              linkSistema: 'https://frotas.unir.br',
            },
          );
        }
      } catch (error) {
        console.error('Erro ao enviar email de rejeição de recurso:', error);
      }
    }

    const logData: LogDto = {
      nomeTabela: 'recurso',
      idRegistro: recurso.idRecurso,
      operacao: 'UPDATE',
      dadosAntigos: null,
      dadosNovos: recursoAtualizado,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logServices.logChange(logData);

    return recursoAtualizado;
  }
}
