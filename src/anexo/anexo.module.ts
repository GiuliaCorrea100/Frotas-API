import { Module } from '@nestjs/common';
import { AnexoController } from './anexo.controller';
import { AnexoService } from './anexo.service';

@Module({
  controllers: [AnexoController],
  providers: [AnexoService],
  exports: [AnexoService],
})
export class AnexoModule {}
