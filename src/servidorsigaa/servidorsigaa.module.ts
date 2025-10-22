/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServidorsigaaService } from './servidorsigaa.service';
import { ServidorsigaaController } from './servidorsigaa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServidorSigaaEntity } from 'src/dbsigaa/entities/servidorsigaa.entity';

@Module({
  providers: [ServidorsigaaService],
  controllers: [ServidorsigaaController],
  exports: [ServidorsigaaService],
  imports: [TypeOrmModule.forFeature([ServidorSigaaEntity], 'sigaaConnection')]
})
export class ServidorsigaaModule {}

