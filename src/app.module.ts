import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarrosModule } from './carros/carros.module';
import { CnhController } from './cnh/cnh.controller';
import { CnhService } from './cnh/cnh.service';
import { CnhModule } from './cnh/cnh.module';

@Module({
  imports: [CarrosModule, CnhModule],
  controllers: [AppController, CnhController],
  providers: [AppService, CnhService],
})
export class AppModule {}
