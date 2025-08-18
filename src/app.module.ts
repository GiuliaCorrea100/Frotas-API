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
import { TipoCombustivelModule } from './tipo_combustivel/tipo_combustivel.module';
import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { PercursoModule } from './percurso/percurso.module';

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
    OcorrenciasModule,
    PercursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
