import { Module, forwardRef } from '@nestjs/common';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciasEntity } from 'src/db/entities/ocorrencias.entity';
import { CorridaModule } from 'src/corrida/corrida.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OcorrenciasEntity]),
    forwardRef(() => CorridaModule),
    LogModule,
  ],
  controllers: [OcorrenciasController],
  providers: [OcorrenciasService],
})
export class OcorrenciasModule {}
