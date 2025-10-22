import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'sigaaConnection',
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST_SIGAA'),
        port: +configService.get<string>('DB_PORT_SIGAA'),
        database: configService.get<string>('DB_NAME_SIGAA'),
        username: configService.get<string>('DB_USERNAME_SIGAA'),
        password: configService.get<string>('DB_PASSWORD_SIGAA'),
        entities: [__dirname + '/entities/**/*.entity.{js,ts}'],
        migrations: [__dirname + '/migrations/**/*.{js,ts}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbSigaaModule {}
