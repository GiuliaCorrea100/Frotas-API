import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CorridaVistoriaController } from './corridaVistoria.controller';
import { CorridaEntity } from '../db/entities/corrida.entity';
import { CorridaVistoriaEntity } from 'src/db/entities/corridaVistoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridaVistoriaEntity, CorridaEntity]),
  ],
  controllers: [CorridaVistoriaController],
  providers: [CorridaVistoriaService],
  exports: [CorridaVistoriaService],
})
export class CorridaVistoriaModule {}