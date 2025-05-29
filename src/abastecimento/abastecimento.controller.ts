import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  AbastecimentoDto,
  AbastecimentoRouteParameters,
  FindAllParameters,
} from './abastecimento.dto';
import { AbastecimentoService } from './abastecimento.service';

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
    if (!abastecimento || Object.keys(abastecimento).length === 0) {
      throw new BadRequestException('Nenhum dado enviado para atualização.');
    }
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
