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
  // MultaRepository: any;
  // emailService: any;
  // usuarioService: any;
  constructor(
    @InjectRepository(RecursoEntity)
    private readonly recursoRepository: Repository<RecursoEntity>,

    @InjectRepository(MultaEntity)
    private readonly multaRepository: Repository<MultaEntity>,
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,

    private readonly logServices: LogService,
    private readonly anexoService: AnexoService,

  ){}

  async create(
    recurso: recursoDto,
    arquivo?: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<RecursoEntity> {

    let urlArquivo = null;

    if (arquivo) {
      try {
        urlArquivo = await this.anexoService.salvarArquivo(arquivo);
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

    foundMulta.situacao = "RECURSO SOLICITADO";

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

    const administradores = await this.usuarioService.findAll({ administrador: true });
    const motorista = await this.usuarioService.findById(currentUserId);

    for (const admin of administradores) {
      await this.emailService.sendMail(
        admin.email, 
        'Solicitação de Recurso de Multa',
        'notificarSolicitarRecurso.hbs',
        {
          nome: admin.nome,           
          motorista: motorista.nome,
          multa: idMulta,
        },
      );
  }

    await this.logServices.logChange(logDataRecurso);

    return savedRecurso;
  }

  // findAll() {
  //   return `This action returns all recurso`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} recurso`;
  // }

  // update(id: number, recursoDto: recursoDto) {
  //   return `This action updates a #${id} recurso`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} recurso`;
  // }
}
