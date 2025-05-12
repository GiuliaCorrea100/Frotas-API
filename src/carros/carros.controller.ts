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
<<<<<<< HEAD
import { FindAllParameters, CarrosDto } from './carros.dto';
=======
import {
  FindAllParameters,
  CarrosDto,
  CarrosRouteParameters,
} from './carros.dto';
>>>>>>> e833801 (adc no gitlab)
import { CarrosService } from './carros.service';

@Controller('carros')
export class CarrosController {
  constructor(private readonly carrosService: CarrosService) {}

  @Post()
<<<<<<< HEAD
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
=======
  async create(@Body() carros: CarrosDto): Promise<CarrosDto> {
    return await this.carrosService.create(carros);
  }

  @Get('/:idCarros')
  async findById(@Param('idCarros') idCarros: number): Promise<CarrosDto> {
    return this.carrosService.findById(idCarros);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CarrosDto[]> {
    return this.carrosService.findAll(params);
  }

  @Put('/:idCarros')
  async update(
    @Param() params: CarrosRouteParameters,
    @Body() carros: CarrosDto,
  ) {
    await this.carrosService.update(params.idCarros, carros);
  }

  @Delete('/:idCarros')
  remove(@Param('idCarros') idCarros: number) {
    return this.carrosService.remove(idCarros);
>>>>>>> e833801 (adc no gitlab)
  }
}
