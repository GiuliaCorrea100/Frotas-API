import { Module } from '@nestjs/common';
import { MultasService } from './multas.service';

@Module({
  providers: [MultasService]
})
export class MultasModule {}
