import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  private mapEntityToDto(UserSinguEntity: UserSinguEntity): UserSinguDto {
    return {
      idUsuarioSingu: UserSinguEntity.idUsuarioSingu,
      idPessoaSingu: UserSinguEntity.idPessoaSingu,
      senha: UserSinguEntity.senha,
      nome: UserSinguEntity.nome,
      email: UserSinguEntity.email,
      login: UserSinguEntity.login,
    };
  }
}
