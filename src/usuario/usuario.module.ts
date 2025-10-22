import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/db/entities/usuario.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity]), LogModule],
  providers: [UsuarioService],
  exports: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
