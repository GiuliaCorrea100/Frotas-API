/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaController } from './corrida.controller';
import { CorridaEntity } from 'src/db/entities/corrida.entity';
import { LogModule } from 'src/log/log.module';
import { UsuarioSigaaModule } from 'src/usuariosigaa/usuariosigaa.module';
import { EmailModule } from 'src/email/email.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CarroModule } from 'src/carro/carro.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridaEntity]),
    forwardRef(() => UsuarioSigaaModule),
    LogModule,
    // Só importa se AUTH=SIGAA
    ...(process.env.AUTH === 'SIGAA' ? [forwardRef(() => UsuarioSigaaModule)] : []),
    EmailModule,
    UsuarioModule,
    CarroModule,
  ],
  controllers: [CorridaController],
  exports: [CorridaService],
  providers: [CorridaService],
})
export class CorridaModule {}
