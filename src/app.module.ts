import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarrosModule } from './carros/carros.module';
import { CnhModule } from './cnh/cnh.module';
import { MultasModule } from './multas/multas.module';
import { AbastecimentoModule } from './abastecimento/abastecimento.module';
import { CorridaModule } from './corrida/corrida.module';

@Module({
  imports: [
    CarrosModule,
    CnhModule,
    MultasModule,
    AbastecimentoModule,
    CorridaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
