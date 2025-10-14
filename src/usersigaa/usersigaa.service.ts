/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSigaaDto } from './usersigaa.dto';
import { UserSigaaEntity } from 'src/dbsigaa/entities/usersigaa.entity';
import { ServidorSigaaEntity } from 'src/dbsigaa/entities/servidorsigaa.entity';

@Injectable()
export class UsersigaaService {

  constructor(
    @InjectRepository(UserSigaaEntity, 'sigaaConnection')
    private readonly usersRepository: Repository<UserSigaaEntity>,
    
    @InjectRepository(ServidorSigaaEntity, 'sigaaConnection')
    private readonly servidorRepository: Repository<ServidorSigaaEntity>,
  ) { }

  async findByUserLogin(login: string): Promise<UserSigaaDto | null> {
    console.log(login);
    const loginFound = await this.usersRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.pessoa', 'pessoa')
      .leftJoinAndSelect('usuario.servidor', 'servidor')
      .where('usuario.login = :login', { login })
      .getOne();

    if (!loginFound) {
      return null;
    }

    return this.mapEntityToDto(loginFound, loginFound.pessoa.nome, loginFound.email);
  }

  async findByNomeSimilar(nomeNormalizado: string) {
    const usuarios = await this.usersRepository
      .createQueryBuilder('usuario') 
      .innerJoinAndSelect('usuario.pessoa', 'pessoa')
      .innerJoinAndSelect('usuario.servidor', 'servidor')
      .select([
        'usuario.idPessoaSigaa AS "idPessoaSigaa"',
        'pessoa.cpf_cnpj AS "cpf"',   
        'pessoa.nome AS "nome"',        
      ]) 
      .where("LOWER(pessoa.nome) LIKE LOWER(:nome)", { 
        nome: `%${nomeNormalizado}%`
      })
      .getRawMany();

    return usuarios;
  }

  private mapEntityToDto(userEntity: UserSigaaEntity, nome: string, email: string, tipoUsuario?: string): UserSigaaDto {
    return {
      idUsuarioSigaa: userEntity.idUsuarioSigaa,
      idPessoaSigaa: userEntity.idPessoaSigaa,
      login: userEntity.login,
      senha: userEntity.senha,
      nome: nome,
      email: email,
       ...(tipoUsuario && { tipoUsuario })
    }
  }
}
