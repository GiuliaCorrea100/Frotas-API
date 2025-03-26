import { Module } from '@nestjs/common';
import { CnhController } from './cnh.controller';
import { CnhService } from './cnh.service';

@Module({
  controllers: [CnhController],
  providers: [CnhService],
})
export class CnhModule {}
