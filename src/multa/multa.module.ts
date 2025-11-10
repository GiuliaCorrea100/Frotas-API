// INÍCIO DA MODIFICAÇÃO (Importar forwardRef)
import { Module, forwardRef } from '@nestjs/common';
// FIM DA MODIFICAÇÃO
import { MultaService } from './multa.service';
import { MultaController } from './multa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { LogModule } from 'src/log/log.module';
// INÍCIO DA MODIFICAÇÃO (Importar CorridaModule)
import { CorridaModule } from '../corrida/corrida.module';
// FIM DA MODIFICAÇÃO

@Module({
  imports: [
    TypeOrmModule.forFeature([MultaEntity]),
    LogModule,
    // INÍCIO DA MODIFICAÇÃO (Adicionar CorridaModule com forwardRef)
    // Adicionado para permitir a injeção do CorridaService no MultaService
    forwardRef(() => CorridaModule),
    // FIM DA MODIFICAÇÃO
  ],
  controllers: [MultaController],
  providers: [MultaService],
})
export class MultaModule {}
