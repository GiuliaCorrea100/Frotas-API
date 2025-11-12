import { Module } from '@nestjs/common';
import { MultaService } from './multa.service';
import { MultaController } from './multa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { LogModule } from 'src/log/log.module';
import { CorridaModule } from 'src/corrida/corrida.module';

@Module({
  imports: [TypeOrmModule.forFeature([MultaEntity]), CorridaModule, LogModule],
  controllers: [MultaController],
  providers: [MultaService],
})
export class MultaModule {}
