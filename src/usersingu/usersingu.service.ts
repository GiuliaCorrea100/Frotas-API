import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';
import { UserSinguDto } from './usersingu.dto';

@Injectable()
export class UserSinguService {
  constructor(
    @InjectRepository(UserSinguEntity)
    private readonly UserSinguRepository: Repository<UserSinguEntity>,
  ) {}

  async findByLogin(login: string): Promise<UserSinguDto> {
    const foundUser = await this.UserSinguRepository.findOne({
      where: { login },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with login ${login} not found`);
    }
    return this.mapEntityToDto(foundUser);
  }

  async findById(idPessoa: number): Promise<UserSinguDto> {
    const foundUser = await this.UserSinguRepository.findOne({
      where: { idPessoa },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoa} not found`);
    }
    return this.mapEntityToDto(foundUser);
  }

  async findByNome(nome?: string): Promise<UserSinguDto[]> {
    console.log('entrando na função');
    if (!nome || nome.length < 3) {
      return [];
    }

    console.log('🔍 Buscando por nome:', nome);

    const usuarios = await this.UserSinguRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      take: 10,
      order: {
        nome: 'ASC',
      },
    });

    return usuarios.map((user) => this.mapEntityToDto(user));
  }

  private mapEntityToDto(UserSinguEntity: UserSinguEntity): UserSinguDto {
    return {
      idPessoa: UserSinguEntity.idPessoa,
      //idPessoaSingu: UserSinguEntity.idPessoaSingu,
      senha: UserSinguEntity.senha,
      nome: UserSinguEntity.nome,
      email: UserSinguEntity.email,
      login: UserSinguEntity.login,
    };
  }
}
