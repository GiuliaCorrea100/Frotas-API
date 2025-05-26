import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoCombustivelService } from './tipo_combustivel.service';
import {
  TipoCombustivelDto,
  TipoCombustivelRouteParams,
} from './tipo_combustivel.dto';

@Controller('tipo-combustivel')
export class TipoCombustivelController {
  constructor(
    private readonly tipoCombustivelService: TipoCombustivelService,
  ) {}

  @Post()
  create(@Body() dto: TipoCombustivelDto) {
    return this.tipoCombustivelService.create(dto);
  }

  @Patch(':tipo_combustivel_id')
  update(
    @Param() params: TipoCombustivelRouteParams,
    @Body() dto: TipoCombustivelDto,
  ) {
    return this.tipoCombustivelService.update(
      params.tipo_combustivel_id,
      dto,
    );
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
