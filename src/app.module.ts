import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarrosModule } from './carros/carros.module';
import { CnhModule } from './cnh/cnh.module';
import { MultasController } from './multas/multas.controller';
import { MultasModule } from './multas/multas.module';

@Module({
  imports: [CarrosModule, CnhModule, MultasModule],
  controllers: [AppController, MultasController],
  providers: [AppService],
})
export class AppModule {}
