import { Module, forwardRef } from '@nestjs/common';
import { MultaService } from './multa.service';
import { MultaController } from './multa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultaEntity } from 'src/db/entities/multa.entity';
import { LogModule } from 'src/log/log.module';
import { CorridaModule } from 'src/corrida/corrida.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { EmailModule } from '../email/email.module';
import { AnexoModule } from '../anexo/anexo.module';
import { PercursoModule } from '../percurso/percurso.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MultaEntity]),
    LogModule,
    EmailModule,
    UsuarioModule,
    AnexoModule,
    forwardRef(() => PercursoModule),
    forwardRef(() => CorridaModule),
  ],
  controllers: [MultaController],
  providers: [MultaService],
  exports: [MultaService],
})
export class MultaModule {}
