import { Module } from '@nestjs/common';
import { MultasService } from './multas.service';
import { MultasController } from './multas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultasEntity } from 'src/db/entities/multas.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([MultasEntity]), LogModule],
  controllers: [MultasController],
  providers: [MultasService],
})
export class MultasModule {}
