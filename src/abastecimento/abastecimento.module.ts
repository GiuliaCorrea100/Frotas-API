import { Module } from '@nestjs/common';
import { AbastecimentoController } from './abastecimento.controller';
import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoEntity } from 'src/db/entities/abastecimento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AbastecimentoEntity])],
  controllers: [AbastecimentoController],
  providers: [AbastecimentoService],
})
export class AbastecimentoModule {}
