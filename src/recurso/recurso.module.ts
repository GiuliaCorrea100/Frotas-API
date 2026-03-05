import { Module } from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { RecursoController } from './recurso.controller';
import { LogModule } from 'src/log/log.module';
import { MultaModule } from 'src/multa/multa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoEntity } from 'src/db/entities/recurso.entity';
import { AnexoModule } from 'src/anexo/anexo.module';
import { MultaEntity } from 'src/db/entities/multa.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([RecursoEntity, MultaEntity]),
    MultaModule,
    LogModule,
    AnexoModule,
  ], 
  controllers: [RecursoController],
  providers: [RecursoService],
  exports: [RecursoService],
})
export class RecursoModule {}
