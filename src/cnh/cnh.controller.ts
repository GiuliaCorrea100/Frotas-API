import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CnhService } from './cnh.service';
import { CnhDto, FindAllParameters, CnhRouteParameters } from './cnh.dto';

@Controller('cnh')
export class CnhController {
  constructor(private readonly cnhService: CnhService) {}

  @Post()
  async create(@Body() cnh: CnhDto): Promise<CnhDto> {
    return await this.cnhService.create(cnh);
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
  async update(@Param() params: CnhRouteParameters, @Body() cnh: CnhDto) {
    await this.cnhService.update(params.idCnh, cnh);
  }

  @Delete('/:idCnh')
  remove(@Param('idCnh') idCnh: number) {
    return this.cnhService.remove(idCnh);
  }
}
