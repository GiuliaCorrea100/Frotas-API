/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaController } from './corrida.controller';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { LogModule } from 'src/log/log.module';
import { UsuarioSigaaModule } from 'src/usuariosigaa/usuariosigaa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridasEntity]),
    forwardRef(() => UsuarioSigaaModule),
    LogModule,
    // Só importa se AUTH=SIGAA
    ...(process.env.AUTH === 'SIGAA' ? [forwardRef(() => UsuarioSigaaModule)] : []),
  ],
  controllers: [CorridaController],
  exports: [CorridaService],
  providers: [CorridaService],
})
export class CorridaModule {}
