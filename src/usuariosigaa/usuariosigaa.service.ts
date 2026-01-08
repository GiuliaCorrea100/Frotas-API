/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioSigaaDto } from './usuariosigaa.dto';
import { UsuarioSigaaEntity } from 'src/dbsigaa/entities/usuariosigaa.entity';
import { md5 } from 'src/util/md5';

@Injectable()
export class UsuarioSigaaService {

  constructor(
    @InjectRepository(UsuarioSigaaEntity, 'sigaaConnection')
    private readonly usuarioSigaaRepository: Repository<UsuarioSigaaEntity>,
  ) { }

  async findByUserLogin(login: string): Promise<UsuarioSigaaDto | null> {
    const loginFound = await this.usuarioSigaaRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.pessoa', 'pessoa')
      .leftJoinAndSelect('usuario.servidor', 'servidor')
      .where('usuario.login = :login', { login })
      .getOne();

    if (!loginFound) {
      return null;
    }

    if (!loginFound.servidor) {
      throw new UnauthorizedException('Apenas servidores podem acessar o sistema');
    }

    return this.mapEntityToDto(loginFound, loginFound.pessoa.nome, loginFound.email);
  }

  async findByNomeSimilar(nomeNormalizado: string) {
    const usuarios = await this.usuarioSigaaRepository
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

  async confirmarSenha(idPessoaSigaa: number, senha: string): Promise<boolean> {
    const foundUser = await this.usuarioSigaaRepository.findOne({
      where: { idPessoaSigaa },
    });

    if (!foundUser) {
      throw new NotFoundException(`Item with id ${idPessoaSigaa} not found`);
    }
    const senhaHash = md5(senha);

    if (senhaHash === foundUser.senha) {
      return true;
    } else {
      return false;
    }
  }

  private mapEntityToDto(userEntity: UsuarioSigaaEntity, nome: string, email: string): UsuarioSigaaDto {
    return {
      idUsuarioSigaa: userEntity.idUsuarioSigaa,
      idPessoaSigaa: userEntity.idPessoaSigaa,
      login: userEntity.login,
      senha: userEntity.senha,
      nome: nome,
      email: email,
    }
  }
}
