import { Module, forwardRef } from '@nestjs/common';
import { ocorrenciaController } from './ocorrencia.controller';
import { ocorrenciaService } from './ocorrencia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaEntity } from 'src/db/entities/ocorrencia.entity';
import { CorridaModule } from 'src/corrida/corrida.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OcorrenciaEntity]),
    forwardRef(() => CorridaModule),
    LogModule,
  ],
  controllers: [ocorrenciaController],
  providers: [ocorrenciaService],
  exports: [ocorrenciaService],
})
export class OcorrenciaModule {}
