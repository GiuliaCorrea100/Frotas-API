import { Module } from '@nestjs/common';
import { CnhController } from './cnh.controller';
import { CnhService } from './cnh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnhEntity } from 'src/db/entities/cnh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CnhEntity])],
  controllers: [CnhController],
  providers: [CnhService],
})
export class CnhModule {}
