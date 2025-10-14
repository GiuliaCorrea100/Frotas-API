import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersDto, FindAllParameters } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, FindOptionsWhere } from 'typeorm';
import { UserEntity } from 'src/db/entities/users.entity';
import { LogService } from '../log/log.service';
import { LogDto } from '../log/log.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UsersRepository: Repository<UserEntity>,
    private readonly logService: LogService,
  ) {}

  async findByName(nome: string): Promise<UsersDto[]> {
    const usersFound = await this.UsersRepository.createQueryBuilder('user')
      .where('LOWER(user.nome) LIKE LOWER(:nome)', { nome: `%${nome}%` })
      .getMany();

    if (!usersFound || usersFound.length === 0) {
      return [];
    }

    return usersFound.map((userEntity) => this.mapEntityToDto(userEntity));
  }

  async create(
    users: UsersDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const usersToSave: UserEntity = {
      idPessoaSigaa: users.idPessoaSigaa,
      permissao: users.permissao,
      nome: users.nome,
    };

    const savedUser = await this.UsersRepository.save(usersToSave);

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

  async findByIdPessoaSigaa(idPessoaSigaa: number): Promise<UsersDto | null> {
    const foundUser = await this.UsersRepository.findOne({
      where: { idPessoaSigaa },
    });

    if (!foundUser) {
      return null;
    }

    return this.mapEntityToDto(foundUser);
  }

  async findAll(params: FindAllParameters): Promise<UsersDto[]> {
    const searchParams: FindOptionsWhere<UserEntity> = {};

    if (params.permissao) {
      searchParams.permissao = Equal(params.permissao);
    }
    const usersFound = await this.UsersRepository.find({
      where: searchParams,
    });
    return usersFound.map((UserEntity) => this.mapEntityToDto(UserEntity));
  }

  async permissaoAdm(
    idPessoaSigaa: number,
    currentUserId?: number,
    currentUserName?: string,
  ): Promise<void> {
    const foundUser = await this.UsersRepository.findOne({
      where: { idPessoaSigaa },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoaSigaa} not found`);
    }

    const dadosAntigos = { ...foundUser };

    if (foundUser.permissao == 2) {
      foundUser.permissao = 1;
    } else {
      foundUser.permissao = 2;
    }

    const updatedUser = await this.UsersRepository.save(foundUser);

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

  async findUserSingu(idUsuario: number): Promise<number> {
    const foundUser = await this.UsersRepository.findOne({
      where: { idUsuario },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idUsuario} not found`);
    }
    return foundUser.idPessoaSigaa;
  }

  async update(
    idUsuario: number,
    users: UsersDto,
    currentUserId?: number,
    currentUserName?: string,
  ) {
    const foundUser = await this.UsersRepository.findOne({
      where: { idUsuario },
    });

    if (!foundUser) {
      throw new HttpException(
        `Item with id ${users.idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dadosAntigos = { ...foundUser };

    await this.UsersRepository.update(idUsuario, this.mapDtoToEntity(users));

    const updatedUser = await this.UsersRepository.findOne({
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
    const userToDelete = await this.UsersRepository.findOne({
      where: { idUsuario },
    });

    if (!userToDelete) {
      throw new HttpException(
        `Item with id ${idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.UsersRepository.delete(idUsuario);

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

  private mapEntityToDto(UserEntity: UserEntity): UsersDto {
    return {
      idUsuario: UserEntity.idUsuario,
      idPessoaSigaa: UserEntity.idPessoaSigaa,
      permissao: UserEntity.permissao,
      nome: UserEntity.nome,
    };
  }

  private mapDtoToEntity(UsersDto: UsersDto): Partial<UserEntity> {
    return {
      idPessoaSigaa: UsersDto.idPessoaSigaa,
      permissao: UsersDto.permissao,
      nome: UsersDto.nome,
    };
  }
}
