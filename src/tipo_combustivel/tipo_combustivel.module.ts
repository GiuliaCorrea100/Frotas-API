import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { TipoCombustivelController } from './tipo_combustivel.controller';
import { TipoCombustivelService } from './tipo_combustivel.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCombustivelEntity])],
  controllers: [TipoCombustivelController],
  providers: [TipoCombustivelService],
  exports: [TipoCombustivelService, TypeOrmModule, TypeOrmModule],
})
export class TipoCombustivelModule {}
