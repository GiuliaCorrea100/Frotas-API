import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioDto, FindAllParameters } from './usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindOptionsWhere } from 'typeorm';
import { UsuarioEntity } from 'src/db/entities/usuario.entity';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly UsuarioRepository: Repository<UsuarioEntity>,
    private readonly logService: LogService,
  ) {}

  async findByName(nome: string): Promise<UsuarioDto[]> {
    const usersFound = await this.UsuarioRepository.createQueryBuilder('user')
      .where('LOWER(user.nome) LIKE LOWER(:nome)', { nome: `%${nome}%` })
      .getMany();

    if (!usersFound || usersFound.length === 0) {
      return [];
    }

    return usersFound.map((userEntity) => this.mapEntityToDto(userEntity));
  }

  async create(
    users: UsuarioDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const usersToSave: UsuarioEntity = {
      idPessoaSigaa: users.idPessoaSigaa,
      administrador: users.administrador,
      nome: users.nome,
    };

    const savedUser = await this.UsuarioRepository.save(usersToSave);

    console.log('Dados do log (create):', {
      currentUserId,
      currentUserName,
      idRegistro: savedUser.idUsuario,
    });

    const logData: LogDto = {
      nomeTabela: 'usuario',
      idRegistro: savedUser.idUsuario,
      operacao: 'INSERT',
      dadosAntigos: null,
      dadosNovos: savedUser,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);

    return savedUser;
  }

  async findByIdPessoaSigaa(idPessoaSigaa: number): Promise<UsuarioDto | null> {
    const foundUser = await this.UsuarioRepository.findOne({
      where: { idPessoaSigaa },
    });

    if (!foundUser) {
      return null;
    }

    return this.mapEntityToDto(foundUser);
  }

  async consultaCadastroUsuario(
    idPessoaSigaa: number,
    nome: string,
  ): Promise<UsuarioEntity> {
    let userFound = await this.findByIdPessoaSigaa(idPessoaSigaa);

    if (!userFound) {
      const novoUsuario = {
        idPessoaSigaa,
        nome,
        administrador: false,
      };
      userFound = await this.create(novoUsuario);
    }

    return {
      idUsuario: Number(userFound.idUsuario),
      idPessoaSigaa: Number(userFound.idPessoaSigaa),
      nome: userFound.nome,
      administrador: userFound.administrador,
    };
  }

  async findAll(params: FindAllParameters): Promise<UsuarioDto[]> {
    const searchParams: FindOptionsWhere<UsuarioEntity> = {};

    if (params.administrador !== undefined) {
      searchParams.administrador = Equal(params.administrador);
    }

    const usersFound = await this.UsuarioRepository.find({
      where: searchParams,
    });

    return usersFound.map((userEntity) => this.mapEntityToDto(userEntity));
  }

  async permissaoAdm(
    idUsuario: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundUser = await this.UsuarioRepository.findOne({
      where: { idUsuario },
    });

    const dadosAntigos = { ...foundUser };

    foundUser.administrador = !foundUser.administrador;

    const updatedUser = await this.UsuarioRepository.save(foundUser);

    console.log('Dados do log (permissaoAdm):', {
      currentUserId,
      currentUserName,
      idRegistro: updatedUser.idUsuario,
    });

    const logData: LogDto = {
      nomeTabela: 'usuario',
      idRegistro: updatedUser.idUsuario,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedUser,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async findUserId(idUsuario: number): Promise<UsuarioDto | null> {
    const foundUser = await this.UsuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!foundUser) {
      return null;
    }

    return this.mapEntityToDto(foundUser);
  }

  async update(
    idUsuario: number,
    users: UsuarioDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundUser = await this.UsuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!foundUser) {
      throw new HttpException(
        `Item with id ${users.idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundUser };

    await this.UsuarioRepository.update(idUsuario, this.mapDtoToEntity(users));

    const updatedUser = await this.UsuarioRepository.findOne({
      where: { idUsuario },
    });

    console.log('Dados do log (update):', {
      currentUserId,
      currentUserName,
      idRegistro: idUsuario,
    });

    const logData: LogDto = {
      nomeTabela: 'usuario',
      idRegistro: idUsuario,
      operacao: 'UPDATE',
      dadosAntigos: dadosAntigos,
      dadosNovos: updatedUser,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  async remove(
    idUsuario: number,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const userToDelete = await this.UsuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!userToDelete) {
      throw new HttpException(
        `Item with id ${idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.UsuarioRepository.delete(idUsuario);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log('Dados do log (remove):', {
      currentUserId,
      currentUserName,
      idRegistro: idUsuario,
    });

    const logData: LogDto = {
      nomeTabela: 'usuario',
      idRegistro: idUsuario,
      operacao: 'DELETE',
      dadosAntigos: userToDelete,
      dadosNovos: null,
      idUsuario: currentUserId,
      usuario: currentUserName,
    };

    await this.logService.logChange(logData);
  }

  private mapEntityToDto(usuarioEntity: UsuarioEntity): UsuarioDto {
    return {
      idUsuario: usuarioEntity.idUsuario,
      idPessoaSigaa: usuarioEntity.idPessoaSigaa,
      administrador: usuarioEntity.administrador,
      nome: usuarioEntity.nome,
    };
  }

  private mapDtoToEntity(usuarioDto: UsuarioDto): Partial<UsuarioEntity> {
    return {
      idPessoaSigaa: usuarioDto.idPessoaSigaa,
      administrador: usuarioDto.administrador,
      nome: usuarioDto.nome,
    };
  }
}
