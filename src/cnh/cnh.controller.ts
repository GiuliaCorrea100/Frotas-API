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
import { CnhDto, FindAllParameters } from './cnh.dto';

@Controller('cnh')
export class CnhController {
  constructor(private readonly cnhService: CnhService) {}

  @Post()
  create(@Body() cnh: CnhDto) {
    this.cnhService.create(cnh);
  }

  @Get('/:id')
  findById(@Param('id') id: number): CnhDto {
    return this.cnhService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): CnhDto[] {
    return this.cnhService.findAll(params);
  }

  @Put()
  update(@Body() cnh: CnhDto) {
    this.cnhService.update(cnh);
  }
  //Revisar essa função, ver se vai deletar pelo rg mesmo ou não
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.cnhService.remove(id);
  }
}
