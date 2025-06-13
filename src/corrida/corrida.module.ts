import { Module } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaController } from './corrida.controller';
import { CorridasEntity } from 'src/db/entities/corrida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CorridasEntity])],
  controllers: [CorridaController],
  providers: [CorridaService],
})
export class CorridaModule {}
