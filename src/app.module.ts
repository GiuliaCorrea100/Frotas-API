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
import { DbModule } from './db/db.module';

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
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
