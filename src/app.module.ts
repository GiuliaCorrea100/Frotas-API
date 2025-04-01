import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarrosModule } from './carros/carros.module';
import { CnhModule } from './cnh/cnh.module';
import { MultasController } from './multas/multas.controller';
import { MultasModule } from './multas/multas.module';
import { AbastecimentoController } from './abastecimento/abastecimento.controller';
import { AbastecimentoService } from './abastecimento/abastecimento.service';
import { AbastecimentoModule } from './abastecimento/abastecimento.module';
import { CorridaController } from './corrida/corrida.controller';
import { CorridaModule } from './corrida/corrida.module';

@Module({
  imports: [CarrosModule, CnhModule, MultasModule, AbastecimentoModule, CorridaModule],
  controllers: [AppController, MultasController, AbastecimentoController, CorridaController],
  providers: [AppService, AbastecimentoService],
})
export class AppModule {}
