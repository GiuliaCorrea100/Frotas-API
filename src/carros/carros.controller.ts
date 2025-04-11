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
import {
  FindAllParameters,
  CarrosDto,
  CarrosRouteParameters,
} from './carros.dto';
import { CarrosService } from './carros.service';

@Controller('carros')
export class CarrosController {
  constructor(private readonly carrosService: CarrosService) {}

  @Post()
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
  }
}
