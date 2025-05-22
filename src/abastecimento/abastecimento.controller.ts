import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AbastecimentoDto, FindAllParameters } from './abastecimento.dto';
import { AbastecimentoService } from './abastecimento.service';

@Controller('abastecimentos')
export class AbastecimentoController {
  constructor(private readonly abastecimentoService: AbastecimentoService) {}

  @Post()
  async create(@Body() dto: AbastecimentoDto): Promise<AbastecimentoDto> {
    return this.abastecimentoService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<AbastecimentoDto> {
    return this.abastecimentoService.findById(id);
  }

  @Get()
  async findAll(@Query() query: FindAllParameters): Promise<AbastecimentoDto[]> {
    return this.abastecimentoService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AbastecimentoDto,
  ): Promise<void> {
    await this.abastecimentoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.abastecimentoService.remove(id);
  }
}
