import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CorridaVistoriaController } from './corridaVistoria.controller';
import { CorridaEntity } from '../db/entities/corrida.entity';
import { CorridaVistoriaEntity } from 'src/db/entities/corridaVistoria.entity';
import { CorridaVistoriaFotoEntity } from 'src/db/entities/corridaVistoriaFoto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridaVistoriaEntity, CorridaEntity, CorridaVistoriaFotoEntity]),
  ],
  controllers: [CorridaVistoriaController],
  providers: [CorridaVistoriaService, CorridaVistoriaFotoEntity],
  exports: [CorridaVistoriaService, CorridaVistoriaFotoEntity],
})
export class CorridaVistoriaModule {}