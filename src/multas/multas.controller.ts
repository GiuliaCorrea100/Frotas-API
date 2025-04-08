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
import { MultasDto, FindAllParameters } from './multas.dto';
import { MultasService } from './multas.service';

@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  @Post()
  create(@Body() multas: MultasDto) {
    this.multasService.create(multas);
  }

  @Get('/:id')
  findById(@Param('id') id: number): MultasDto {
    return this.multasService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): MultasDto[] {
    return this.multasService.findAll(params);
  }

  @Put()
  update(@Body() multas: MultasDto) {
    this.multasService.update(multas);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.multasService.remove(id);
  }
}
