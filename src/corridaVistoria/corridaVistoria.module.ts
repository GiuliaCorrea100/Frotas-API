import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaVistoriaEntity } from '../db/entities/corridaVistoria.entity';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CorridaVistoriaController } from './corridaVistoria.controller';
import { CorridaEntity } from '../db/entities/corrida.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridaVistoriaEntity, CorridaEntity]),
  ],
  controllers: [CorridaVistoriaController],
  providers: [CorridaVistoriaService],
  exports: [CorridaVistoriaService],
})
export class CorridaVistoriaModule {}