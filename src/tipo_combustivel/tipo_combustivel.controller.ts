import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  TipoCombustivelDto,
  TipoCombustivelRouteParams,
} from './tipo_combustivel.dto';
import { TipoCombustivelService } from './tipo_combustivel.service';

@Controller('tipo-combustivel')
export class TipoCombustivelController {
  constructor(
    private readonly tipoCombustivelService: TipoCombustivelService,
  ) {}

  @Post()
  create(@Body() dto: TipoCombustivelDto) {
    return this.tipoCombustivelService.create(dto);
  }

  @Patch(':id_tipo_combustivel')
  update(
    @Param() params: TipoCombustivelRouteParams,
    @Body() dto: TipoCombustivelDto,
  ) {
    return this.tipoCombustivelService.update(params.id_tipo_combustivel, dto);
  }

  @Get()
  findAll() {
    return this.tipoCombustivelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCombustivelService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoCombustivelService.remove(+id);
  }
}
