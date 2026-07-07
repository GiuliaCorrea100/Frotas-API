import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PercursoController } from './percurso.controller';
import { PercursoService } from './percurso.service';
import { PercursoEntity } from '../db/entities/percurso.entity';
import { LogModule } from '../log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([PercursoEntity]), LogModule],
  controllers: [PercursoController],
  providers: [PercursoService],
  exports: [PercursoService],
})
export class PercursoModule {}
