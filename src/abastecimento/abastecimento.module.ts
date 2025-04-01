import { Module } from '@nestjs/common';
import { AbastecimentoController } from './abastecimento.controller';
import { MultasService } from 'src/multas/multas.service';

@Module({
  controllers: [AbastecimentoController],
  providers: [MultasService],
})
export class AbastecimentoModule {}
