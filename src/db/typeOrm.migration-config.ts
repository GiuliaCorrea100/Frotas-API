import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSourceOptions, DataSource } from 'typeorm';

config();

const configService = new ConfigService();

const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  schema: configService.get<string>('DB_SCHEMA'),
  entities: [],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOption);
