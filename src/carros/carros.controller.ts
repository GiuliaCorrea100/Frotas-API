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
  async create(@Body() carros: CarrosDto): Promise<CarrosDto> {
    return await this.carrosService.create(carros);
  }

  @Get('/:idCarros')
  async findById(@Param('idCarros') id: number): Promise<CarrosDto> {
    return this.carrosService.findById(id);
  }
  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CarrosDto[]> {
    return this.carrosService.findAll(params);
  }

  @Put()
  update(@Body() carros: CarrosDto) {
    this.carrosService.update(carros);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.carrosService.remove(id);
  }
}
