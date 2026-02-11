import { Module } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import { RelatorioController } from './relatorio.controller';
import { AbastecimentoModule } from 'src/abastecimento/abastecimento.module';
import { CarroModule } from 'src/carro/carro.module';
import { CorridaModule } from 'src/corrida/corrida.module';
import { MultaModule } from 'src/multa/multa.module';
import { OcorrenciaModule } from 'src/ocorrencia/ocorrencia.module';

@Module({
  controllers: [RelatorioController],
  providers: [RelatorioService],
  imports: [
    AbastecimentoModule,
    CarroModule,
    CorridaModule,
    MultaModule,
    OcorrenciaModule,
  ],
})
export class RelatorioModule {}
