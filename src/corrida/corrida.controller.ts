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
import { CorridaDto, FindAllParameters } from './corrida.dto';
import { CorridaService } from './corrida.service';

@Controller('corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @Post()
  create(@Body() corrida: CorridaDto) {
    this.corridaService.create(corrida);
  }

  @Get('/:id')
  findById(@Param('id') id: number): CorridaDto {
    return this.corridaService.findById(id);
  }
  @Get()
  findAll(@Query() params: FindAllParameters): CorridaDto[] {
    return this.corridaService.findAll(params);
  }

  @Put()
  update(@Body() corrida: CorridaDto) {
    this.corridaService.update(corrida);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.corridaService.remove(id);
  }
}
