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
import {
  AbastecimentoDto,
  AbastecimentoRouteParameters,
  FindAllParameters,
} from './abastecimento.dto';

@Controller('abastecimento')
export class AbastecimentoController {
  constructor(private readonly abastecimentoService: AbastecimentoService) {}

  @Post()
  async create(
    @Body() abastecimento: AbastecimentoDto,
  ): Promise<AbastecimentoDto> {
    return await this.abastecimentoService.create(abastecimento);
  }

  @Get('/:idAbastecimento')
  async findById(
    @Param('idAbastecimento') idAbastecimento: number,
  ): Promise<AbastecimentoDto> {
    return this.abastecimentoService.findById(idAbastecimento);
  }

  @Get()
  async findAll(
    @Query() params: FindAllParameters,
  ): Promise<AbastecimentoDto[]> {
    return this.abastecimentoService.findAll(params);
  }

  @Put('/:idAbastecimento')
  async update(
    @Param() params: AbastecimentoRouteParameters,
    @Body() abastecimento: AbastecimentoDto,
  ) {
    await this.abastecimentoService.update(
      params.idAbastecimento,
      abastecimento,
    );
  }

  @Delete('/:idAbastecimento')
  remove(@Param('idAbastecimento') idAbastecimento: number) {
    return this.abastecimentoService.remove(idAbastecimento);
  }
}
