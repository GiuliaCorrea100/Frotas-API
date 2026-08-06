import { Module } from '@nestjs/common';
import { CarroController } from './carro.controller';
import { carroService } from './carro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';
import { LogModule } from 'src/log/log.module';
import { CarroEntity } from 'src/db/entities/carro.entity';
import { AnexoModule } from '../anexo/anexo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarroEntity, TipoCombustivelEntity]),
    LogModule,
    AnexoModule,
  ],
  controllers: [CarroController],
  providers: [carroService],
  exports: [carroService],
})
export class CarroModule {}
