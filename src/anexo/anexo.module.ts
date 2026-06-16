import { Module } from '@nestjs/common';
import { AnexoController } from './anexo.controller';
import { AnexoService } from './anexo.service';
import { CorridaVistoriaModule } from 'src/corridaVistoria/corridaVistoria.module';
import { CorridaVistoriaFotoEntity } from 'src/db/entities/corridaVistoriaFoto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CorridaVistoriaModule,TypeOrmModule.forFeature([CorridaVistoriaFotoEntity])],
  controllers: [AnexoController],
  providers: [AnexoService],
  exports: [AnexoService],
})
export class AnexoModule {}
