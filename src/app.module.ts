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
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersinguModule } from './usersingu/usersingu.module';
import { TipoCombustivelModule } from './tipoCombustivel/tipoCombustivel.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { PercursoModule } from './percurso/percurso.module';
import { DbSigaaModule } from './dbsigaa/dbsigaa.module';
import { UsersigaaModule } from './usersigaa/usersigaa.module';
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
    UsersModule,
    UsersinguModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersinguModule,
    TipoCombustivelModule,
    OcorrenciaModule,
    PercursoModule,
    DbSigaaModule,
    UsersigaaModule,
    ServidorsigaaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
