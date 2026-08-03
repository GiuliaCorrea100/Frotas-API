/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { ocorrenciaController } from './ocorrencia.controller';
import { ocorrenciaService } from './ocorrencia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaEntity } from 'src/db/entities/ocorrencia.entity';
import { CorridaModule } from 'src/corrida/corrida.module';
import { LogModule } from 'src/log/log.module';
import { OcorrenciaArquivoEntity } from 'src/db/entities/ocorrenciaArquivo.entity';
import { AnexoModule } from 'src/anexo/anexo.module';
import { EmailModule } from 'src/email/email.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OcorrenciaEntity, OcorrenciaArquivoEntity]),
    forwardRef(() => CorridaModule),
    LogModule,
    EmailModule,
    UsuarioModule,
    AnexoModule,
  ],
  controllers: [ocorrenciaController],
  providers: [ocorrenciaService],
  exports: [ocorrenciaService],
})
export class OcorrenciaModule {}
