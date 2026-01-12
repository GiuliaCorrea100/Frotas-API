/* eslint-disable prettier/prettier */
/* src/dbsigaa/dbsigaa.module */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SigaaPoolManager } from './sigaa-pool-manager.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'sigaaConnection',
      useFactory: async (configService: ConfigService) => {
        if (process.env.AUTH === 'SIGAA') {
          // Configuração para modo SIGAA
          const requiredEnvVars = [
            'DB_HOST_SIGAA',
            'DB_PORT_SIGAA',
            'DB_NAME_SIGAA',
            'DB_USERNAME_SIGAA',
            'DB_PASSWORD_SIGAA',
          ];
          const missingVars = requiredEnvVars.filter(
            (varName) => !configService.get<string>(varName),
          );
          if (missingVars.length > 0) {
            throw new Error(
              `Variáveis de ambiente faltando para conexão SIGAA: ${missingVars.join(', ')}`,
            );
          }
          
          const pgConfig: any = {
            type: 'postgres',
            host: configService.get<string>('DB_HOST_SIGAA'),
            port: +configService.get<string>('DB_PORT_SIGAA'),
            database: configService.get<string>('DB_NAME_SIGAA'),
            username: configService.get<string>('DB_USERNAME_SIGAA'),
            password: configService.get<string>('DB_PASSWORD_SIGAA'),
            entities: [__dirname + '/entities/**/*.entity.{js,ts}'],
            migrations: [__dirname + '/migrations/**/*.{js,ts}'],
            synchronize: false,
            poolSize: 25,
            connectTimeoutMS: 10000,
            extra: {
              max: 25,
              min: 5,
              idleTimeoutMillis: 1800000,
              connectionTimeoutMillis: 10000,
            }
          };
          
          return pgConfig;
        } else {
          // Configuração para modo TEST (conexão mock)
          const sqliteConfig: any = {
            type: 'sqlite',
            database: ':memory:',
            entities: [],
            synchronize: false,
          };
          
          return sqliteConfig;
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SigaaPoolManager],
  exports: [SigaaPoolManager],
})
export class DbSigaaModule {}