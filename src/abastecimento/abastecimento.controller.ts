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
import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';

@Controller('abastecimento')
export class AbastecimentoController {
  constructor(private readonly abastecimentoService: AbastecimentoService) {}

  @Post()
  create(@Body() abastecimento: AbastecimentoDto) {
    this.abastecimentoService.create(abastecimento);
  }

  @Get('/:id')
  findById(@Param('id') id: number): AbastecimentoDto {
    return this.abastecimentoService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): AbastecimentoDto[] {
    return this.abastecimentoService.findAll(params);
  }

  @Put()
  update(@Body() abastecimento: AbastecimentoDto) {
    this.abastecimentoService.update(abastecimento);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.abastecimentoService.remove(id);
  }
}
