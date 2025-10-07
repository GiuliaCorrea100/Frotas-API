import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CnhService } from './cnh.service';
import { CnhDto, FindAllParameters, CnhRouteParameters } from './cnh.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('cnh')
@UseGuards(AuthGuard)
export class CnhController {
  constructor(private readonly cnhService: CnhService) {}

  @Post()
  async create(@Body() cnh: CnhDto, @Request() req: any): Promise<CnhDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.cnhService.create(cnh, currentUserId, currentUserName);
  }

  @Get('/:idCnh')
  async findById(@Param('idCnh') idCnh: number): Promise<CnhDto> {
    return this.cnhService.findById(idCnh);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CnhDto[]> {
    return this.cnhService.findAll(params);
  }

  @Put('/:idCnh')
  async update(
    @Param() params: CnhRouteParameters,
    @Body() cnh: CnhDto,
    @Request() req: any
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.cnhService.update(
      params.idCnh,
      cnh,
      currentUserId,
      currentUserName
    );
  }

  @Delete('/:idCnh')
  remove(@Param('idCnh') idCnh: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.cnhService.remove(idCnh, currentUserId, currentUserName);
  }
}
