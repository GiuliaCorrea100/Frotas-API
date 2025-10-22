/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsuarioSigaaService } from './usuariosigaa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioSigaaEntity } from 'src/dbsigaa/entities/usuariosigaa.entity';
import { ServidorSigaaEntity } from 'src/dbsigaa/entities/servidorsigaa.entity';
import { PessoaSigaaEntity } from 'src/dbsigaa/entities/pessoasigaa.entity';
import { UsuarioSigaaController } from './usuariosigaa.controller';

@Module({
  exports: [UsuarioSigaaService],
  controllers: [UsuarioSigaaController],
  imports: [
    TypeOrmModule.forFeature([UsuarioSigaaEntity, PessoaSigaaEntity, ServidorSigaaEntity], 'sigaaConnection'),
  ],
  providers: [UsuarioSigaaService],
})
export class UsuarioSigaaModule {}
