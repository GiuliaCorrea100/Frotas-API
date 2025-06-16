import { Module } from '@nestjs/common';
import { CarrosController } from './carros.controller';
import { CarrosService } from './carros.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CarrosEntity, TipoCombustivelEntity])],
  controllers: [CarrosController],
  providers: [CarrosService],
})
export class CarrosModule {}
