/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Entity } from 'typeorm';
import { OcorrenciaEntity } from 'src/db/entities/ocorrencia.entity';
import { FindAllParameters, OcorrenciaArquivoDto, ocorrenciaDto } from './ocorrencia.dto';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';
import { OcorrenciaArquivoEntity } from 'src/db/entities/ocorrenciaArquivo.entity';
import { AnexoService } from 'src/anexo/anexo.service';
import { EmailService } from 'src/email/email.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class ocorrenciaService {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,

    @InjectRepository(OcorrenciaArquivoEntity)
    private readonly ocorrenciaArquivoRepository: Repository<OcorrenciaArquivoEntity>,

    private readonly logService: LogService,
    private readonly anexoService: AnexoService,
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(
    ocorrencia: ocorrenciaDto,
    arquivo?: Express.Multer.File,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<OcorrenciaEntity> {
    const ocorrenciaEntity = new OcorrenciaEntity();
    ocorrenciaEntity.descricao = ocorrencia.descricao;
    ocorrenciaEntity.idCorrida = ocorrencia.idCorrida;
    ocorrenciaEntity.dataOcorrencia = ocorrencia.dataOcorrencia;
    ocorrenciaEntity.idMotorista = ocorrencia.idMotorista;

    const savedOcorrencia = await this.ocorrenciaRepository.save(ocorrenciaEntity);

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: savedOcorrencia.idOcorrencia,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    if (ocorrencia.enviadoMotorista) {
      const administrators = await this.usuarioService.findAll({
        administrador: true,
      });
      const motorista = await this.usuarioService.findById(currentUserId);

      for (const admin of administrators) {
        await this.emailService.sendMail(
          admin.email,
          'Registro de Ocorrência',
          'cadastroDeOcorrencia.hbs',
          {
            administrador: admin.nome,
            motorista: motorista.nome,
            corrida: ocorrenciaEntity.idCorrida,
            descricao: ocorrenciaEntity.descricao,
          },
        );
      }
    }

    return savedOcorrencia;
  }

  async salvarArquivos(
      anexos:  OcorrenciaArquivoDto[],
      files: Express.Multer.File[],
    ): Promise< OcorrenciaArquivoDto[]> {
      if (!files || files.length !== anexos.length) {
        throw new BadRequestException(
          `Número de arquivos incompatível. Esperado: ${anexos.length}, Recebido: ${files?.length || 0}`,
        );
      }
  
      const anexosToSave = await Promise.all(
        anexos.map(async (anexo, index) => {
          const file = files[index];
  
          if (!file) {
            throw new BadRequestException(
              `Arquivo não enviado para o anexo ${index + 1}`,
            );
          }
  
          if (!file.buffer || file.buffer.length === 0) {
            throw new BadRequestException(
              `Arquivo vazio para o anexo ${index + 1}`,
            );
          }
  
          const urlArquivo = await this.anexoService.salvarArquivo(
            file,
            'ocorrencias',
            anexo.idOcorrencia,
            'ocorrencia',
          );
          
          console.log(urlArquivo);

          return {
            idOcorrencia: anexo.idOcorrencia,
            urlArquivo: urlArquivo,
            dataUpload: new Date(),
          };
        }),
      );
  
      const savedAnexos =
        await this.ocorrenciaArquivoRepository.save(anexosToSave);
      return savedAnexos;
  }

  async findById(idOcorrencia: number): Promise<ocorrenciaDto> {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }
    return this.mapEntityToDto(foundOcorrencia);
  }

  async findByIdCorrida(idCorrida: number): Promise<ocorrenciaDto[]> {
    const foundOcorrencia = await this.ocorrenciaRepository.find({
      where: { idCorrida },
      relations: {
        motorista: true,
      },
    });

    if (!foundOcorrencia || foundOcorrencia.length === 0) {
      return [];
    }

    return foundOcorrencia.map((ocorrencia) => this.mapEntityToDto(ocorrencia));
  }

  async findAll(params: FindAllParameters): Promise<ocorrenciaDto[]> {
    const searchParams: FindOptionsWhere<OcorrenciaEntity> = {};

    if (params.descricao) {
      searchParams.descricao = Like(`${params.descricao}%`);
    }

    if (params.idCorrida) {
      searchParams.idCorrida = params.idCorrida;
    }

    const ocorrenciaFound = await this.ocorrenciaRepository.find({
      where: searchParams,
    });

    return ocorrenciaFound.map((entity) => this.mapEntityToDto(entity));
  }

  async findByAno(ano: number): Promise<OcorrenciaEntity[]> {
    return this.ocorrenciaRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect('o.corrida', 'corrida')
      .innerJoinAndSelect('corrida.carro', 'carro')
      .innerJoinAndSelect('corrida.motoristaPrincipal', 'motorista')
      .where('EXTRACT(YEAR FROM o.dataOcorrencia) = :ano', { ano })
      .orderBy('o.dataOcorrencia', 'DESC')
      .getMany();
  }

  async update(
    idOcorrencia: number,
    ocorrencia: ocorrenciaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} do not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    await this.ocorrenciaRepository.update(
      idOcorrencia,
      this.mapDtoToEntity(ocorrencia),
    );

    const updatedOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async updateOcorrencia(
    idOcorrencia: number,
    ocorrencia: ocorrenciaDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    foundOcorrencia.descricao = ocorrencia.descricao;
    foundOcorrencia.dataOcorrencia = ocorrencia.dataOcorrencia;
    foundOcorrencia.idMotorista = ocorrencia.idMotorista;

    const updatedOcorrencia =
      await this.ocorrenciaRepository.save(foundOcorrencia);

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedOcorrencia,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idOcorrencia: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const ocorrenciaToDelete = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia: idOcorrencia },
    });

    if (!ocorrenciaToDelete) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...ocorrenciaToDelete };

    const result = await this.ocorrenciaRepository.delete(idOcorrencia);

    if (!result.affected) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const logData: LogDto = {
      nomeTabela: 'ocorrencia',
      idRegistro: idOcorrencia,
      operacao: 'DELETE',
      dadosAntigos: dadosAntigos,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async softRemove(
    idOcorrencia: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundOcorrencia = await this.ocorrenciaRepository.findOne({
      where: { idOcorrencia },
    });

    if (!foundOcorrencia) {
      throw new NotFoundException(`Item with id ${idOcorrencia} not found`);
    }

    const dadosAntigos = { ...foundOcorrencia };

    foundOcorrencia.ativa = false;

    const updatedOcorrencia =
      await this.ocorrenciaRepository.save(foundOcorrencia);

    // const logData: LogDto = {
    //   nomeTabela: 'percurso',
    //   idAbastecimento: idAbastecimento,
    //   operacao: 'UPDATE',
    //   dadosAntigos: dadosAntigos,
    //   dadosNovos: updatedPercurso,
    //   idUsuario: currentUserId,
    //   usuario: currentUserName,
    // };

    // await this.logService.logChange(logData);
  }

  private mapEntityToDto(OcorrenciaEntity: OcorrenciaEntity): ocorrenciaDto {
    return {
      idOcorrencia: OcorrenciaEntity.idOcorrencia,
      descricao: OcorrenciaEntity.descricao,
      idCorrida: OcorrenciaEntity.idCorrida,
      dataOcorrencia: OcorrenciaEntity.dataOcorrencia,
      ativa: OcorrenciaEntity.ativa,
      idMotorista: OcorrenciaEntity.idMotorista,
      nomeMotorista: OcorrenciaEntity.motorista?.nome,
    };
  }

  private mapDtoToEntity(
    ocorrenciaDto: ocorrenciaDto,
  ): Partial<OcorrenciaEntity> {
    return {
      descricao: ocorrenciaDto.descricao,
      idCorrida: ocorrenciaDto.idCorrida,
      dataOcorrencia: ocorrenciaDto.dataOcorrencia,
      ativa: ocorrenciaDto.ativa,
      idMotorista: ocorrenciaDto.idMotorista,
    };
  }
}
