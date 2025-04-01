import { Module } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { CorridaController } from './corrida.controller';

@Module({
  controllers: [CorridaController],
  providers: [CorridaService],
})
export class CorridaModule {}
