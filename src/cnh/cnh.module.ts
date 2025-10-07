import { Module } from '@nestjs/common';
import { CnhController } from './cnh.controller';
import { CnhService } from './cnh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnhEntity } from 'src/db/entities/cnh.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CnhEntity]),
    LogModule,
  ],
  controllers: [CnhController],
  providers: [CnhService],
})
export class CnhModule {}
