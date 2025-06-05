import { Module } from '@nestjs/common';
import { TipoCombustivelService } from './tipo_combustivel.service';
import { TipoCombustivelController } from './tipo_combustivel.controller';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCombustivelEntity])],
  controllers: [TipoCombustivelController],
  providers: [TipoCombustivelService],
  exports: [TipoCombustivelService, TypeOrmModule],
})
export class TipoCombustivelModule {}
