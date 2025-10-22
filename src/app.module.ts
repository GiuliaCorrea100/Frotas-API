import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarrosModule } from './carros/carros.module';
import { CnhModule } from './cnh/cnh.module';
import { MultasModule } from './multas/multas.module';
import { AbastecimentoModule } from './abastecimento/abastecimento.module';
import { CorridaModule } from './corrida/corrida.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { TipoCombustivelModule } from './tipoCombustivel/tipoCombustivel.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { PercursoModule } from './percurso/percurso.module';
import { DbSigaaModule } from './dbsigaa/dbsigaa.module';
import { UsuarioSigaaModule } from './usuariosigaa/usuariosigaa.module';
import { ServidorsigaaModule } from './servidorsigaa/servidorsigaa.module';

@Module({
  imports: [
    CarrosModule,
    CnhModule,
    MultasModule,
    AbastecimentoModule,
    CorridaModule,
    DbModule,
    ConfigModule,
    UsuarioModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TipoCombustivelModule,
    OcorrenciaModule,
    PercursoModule,
    DbSigaaModule,
    UsuarioSigaaModule,
    ServidorsigaaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
