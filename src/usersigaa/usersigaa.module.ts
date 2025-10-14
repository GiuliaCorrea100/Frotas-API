/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersigaaService } from './usersigaa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSigaaEntity } from 'src/dbsigaa/entities/usersigaa.entity';
import { ServidorSigaaEntity } from 'src/dbsigaa/entities/servidorsigaa.entity';
import { PessoaSigaaEntity } from 'src/dbsigaa/entities/pessoasigaa.entity';
import { UserSigaaController } from './usersigaa.controller';

@Module({
  exports: [UsersigaaService],
  controllers: [UserSigaaController],
  imports: [
    TypeOrmModule.forFeature([UserSigaaEntity, PessoaSigaaEntity, ServidorSigaaEntity], 'sigaaConnection'),
  ],
  providers: [UsersigaaService],
})
export class UsersigaaModule {}
