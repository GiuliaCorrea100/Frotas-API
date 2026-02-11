/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarroModule } from './carro/carro.module';
import { CnhModule } from './cnh/cnh.module';
import { MultaModule } from './multa/multa.module';
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
import { EmailModule } from './email/email.module';
import { AnexoModule } from './anexo/anexo.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { RelatorioModule } from './relatorio/relatorio.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    DbSigaaModule,
    UsuarioSigaaModule,
    ServidorsigaaModule,
    CarroModule,
    CnhModule,
    MultaModule,
    AbastecimentoModule,
    CorridaModule,
    ConfigModule,
    UsuarioModule,
    TipoCombustivelModule,
    OcorrenciaModule,
    PercursoModule,
    AuthModule,
    EmailModule,
    AnexoModule,
    GoogleRecaptchaModule.forRoot({
        secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
        response: (req) => req.headers['recaptcha-token'],
        actions: ['SignUp', 'SignIn', 'login'],
        score: 0.8,
    }),
    RelatorioModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}