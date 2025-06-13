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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UsersRepository: Repository<UserEntity>,
  ) {}
  private readonly users: UsersDto[] = [];

  async create(users: UsersDto) {
    const usersToSave: UserEntity = {
      idPessoaSingu: users.idPessoaSingu,
      permissao: users.permissao,
    };

    return await this.UsersRepository.save(usersToSave);
  }

  async findById(idPessoaSingu: number): Promise<UsersDto> {
    const foundUser = await this.UsersRepository.findOne({
      where: { idPessoaSingu },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoaSingu} not found`);
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

  async permissaoAdm(idPessoaSingu: number): Promise<void> {
    //busca o usuario no banco
    const foundUser = await this.UsersRepository.findOne({
      where: { idPessoaSingu },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoaSingu} not found`);
    }

    if (foundUser.permissao == 2) {
      foundUser.permissao = 1;
    } else {
      foundUser.permissao = 2;
    }

    await this.UsersRepository.save(foundUser);
  }

  async update(idUsuario: number, users: UsersDto) {
    const foundUser = await this.UsersRepository.findOne({
      where: { idUsuario },
    });

    if (!foundUser) {
      throw new HttpException(
        `Item with id ${users.idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.UsersRepository.update(idUsuario, this.mapDtoToEntity(users));
  }

  async remove(idUsuario: number) {
    const result = await this.UsersRepository.delete(idUsuario);

    if (!result.affected) {
      throw new HttpException(
        `Item with id ${idUsuario} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(UserEntity: UserEntity): UsersDto {
    return {
      idUsuario: UserEntity.idUsuario,
      idPessoaSingu: UserEntity.idPessoaSingu,
      permissao: UserEntity.permissao,
    };
  }

  private mapDtoToEntity(UsersDto: UsersDto): Partial<UserEntity> {
    return {
      idPessoaSingu: UsersDto.idPessoaSingu,
      permissao: UsersDto.permissao,
    };
  }
}
