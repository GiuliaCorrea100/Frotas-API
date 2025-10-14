/* eslint-disable prettier/prettier */
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserSigaaEntity } from './entities/usersigaa.entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST_SIGAA'),
    port: +configService.get<string>('DB_PORT_SIGAA'),
    username: configService.get<string>('DB_USERNAME_SIGAA'),
    password: configService.get<string>('DB_PASSWORD_SIGAA'),
    database: configService.get<string>('DB_NAME_SIGAA'),
    entities: [UserSigaaEntity],
    synchronize: false
}

export default new DataSource(dataSourceOptions);