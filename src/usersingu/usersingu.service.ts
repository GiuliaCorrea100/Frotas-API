import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';
import { UserSinguDto } from './usersingu.dto';
import { md5 } from 'src/util/md5';

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

  async buscarPorNome(nome: string): Promise<UserSinguDto[]> {
    const foundUsers = await this.UserSinguRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      take: 10,
    });

    return foundUsers.map((user) => this.mapEntityToDto(user));
  }

  async findByNome(nome?: string): Promise<UserSinguDto[]> {
    if (!nome || nome.length < 3) {
      return [];
    }

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

  async confirmarSenha(idPessoa: number, senha: string): Promise<boolean> {
    const foundUser = await this.UserSinguRepository.findOne({
      where: { idPessoa },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoa} not found`);
    }
    const senhaHash = md5(senha);

    if (senhaHash === foundUser.senha) {
      return true;
    } else {
      return false;
    }

    return true;
  }

  private mapEntityToDto(UserSinguEntity: UserSinguEntity): UserSinguDto {
    return {
      idPessoa: UserSinguEntity.idPessoa,
      senha: UserSinguEntity.senha,
      nome: UserSinguEntity.nome,
      email: UserSinguEntity.email,
      login: UserSinguEntity.login,
    };
  }
}
