import { Module } from '@nestjs/common';
import { AbastecimentoController } from './abastecimento.controller';
import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoEntity } from 'src/db/entities/abastecimento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbastecimentoEntity,
      TipoCombustivelEntity,
      CorridasEntity,
    ]),
    LogModule,
  ],
  controllers: [AbastecimentoController],
  providers: [AbastecimentoService],
})
export class AbastecimentoModule {}