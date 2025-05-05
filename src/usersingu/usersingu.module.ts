import { Module } from '@nestjs/common';
import { UserSinguService } from './usersingu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserSinguEntity])],
  providers: [UserSinguService],
  exports: [UserSinguService],
})
export class UsersinguModule {}
