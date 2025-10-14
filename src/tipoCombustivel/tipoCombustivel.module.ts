import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { TipoCombustivelController } from './tipoCombustivel.controller';

import { LogModule } from 'src/log/log.module';
import { TipoCombustivelService } from './tipoCombustivel.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCombustivelEntity]), LogModule],
  controllers: [TipoCombustivelController],
  providers: [TipoCombustivelService],
  exports: [TipoCombustivelService, TypeOrmModule, TypeOrmModule],
})
export class TipoCombustivelModule {}
