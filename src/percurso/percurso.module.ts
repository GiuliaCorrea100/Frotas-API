import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PercursoController } from './percurso.controller';
import { PercursoService } from './percurso.service';
import { PercursoEntity } from '../db/entities/percurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PercursoEntity])],
  controllers: [PercursoController],
  providers: [PercursoService],
})
export class PercursoModule {}