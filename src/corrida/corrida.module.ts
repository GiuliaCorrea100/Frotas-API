import { Module, forwardRef } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorridaController } from './corrida.controller';
import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { UsersinguModule } from '../usersingu/usersingu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorridasEntity]),
    forwardRef(() => UsersinguModule),
  ],
  controllers: [CorridaController],
  providers: [CorridaService],
})
export class CorridaModule {}
