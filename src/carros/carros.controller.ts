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
import { FindAllParameters, CarrosDto } from './carros.dto';
import { CarrosService } from './carros.service';

@Controller('carros')
export class CarrosController {
  constructor(private readonly carrosService: CarrosService) {}

  @Post()
  create(@Body() carros: CarrosDto) {
    this.carrosService.create(carros);
  }

  @Get('/:id')
  findById(@Param('id') id: string): CarrosDto {
    return this.carrosService.findById(id);
  }
  @Get()
  findAll(@Query() params: FindAllParameters): CarrosDto[] {
    return this.carrosService.findAll(params);
  }

  @Put()
  update(@Body() carros: CarrosDto) {
    this.carrosService.update(carros);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.carrosService.remove(id);
  }
}
