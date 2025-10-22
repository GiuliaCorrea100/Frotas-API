import { Module } from '@nestjs/common';
import { CarrosController } from './carros.controller';
import { CarrosService } from './carros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarrosEntity, TipoCombustivelEntity]),
    LogModule,
  ],
  controllers: [CarrosController],
  providers: [CarrosService],
})
export class CarrosModule {}
