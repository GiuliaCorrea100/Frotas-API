import { Controller, Get, Param } from '@nestjs/common';
import { UserSinguDto } from './usersingu.dto';
import { UserSinguService } from './usersingu.service';

@Controller('usersingu')
export class UsersinguController {
  constructor(private readonly UserSinguService: UserSinguService) {}

  @Get('/:login')
  async findByLogin(@Param('login') login: string): Promise<UserSinguDto> {
    return this.UserSinguService.findByLogin(login);
  }

  @Get('/buscar-id/:idPessoa')
  async findById(@Param('idPessoa') idPessoa: number): Promise<UserSinguDto> {
    return await this.UserSinguService.findById(idPessoa);
  }
}
