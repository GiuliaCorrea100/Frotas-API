import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CarrosDto,
  CarrosRouteParameters,
  FindAllParameters,
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

  @Patch(':id/inativar')
  async inativar(@Param('id') id: number) {
    return this.carrosService.inativar(id);
  }
}
