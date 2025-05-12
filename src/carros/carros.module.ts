import { Module } from '@nestjs/common';
import { CarrosController } from './carros.controller';
import { CarrosService } from './carros.service';
<<<<<<< HEAD

@Module({
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosEntity } from 'src/db/entities/carros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarrosEntity])],
>>>>>>> e833801 (adc no gitlab)
  controllers: [CarrosController],
  providers: [CarrosService],
})
export class CarrosModule {}
