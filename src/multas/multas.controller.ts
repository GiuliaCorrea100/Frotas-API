import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import {
  MultasDto,
  FindAllParameters,
  MultasRouteParameters,
} from './multas.dto';
import { MultasService } from './multas.service';

@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  @Post()
  async create(@Body() multas: MultasDto): Promise<MultasDto> {
    return await this.multasService.create(multas);
  }

  @Get('/:idMultas')
  async findById(@Param('idMultas') idMultas: number): Promise<MultasDto> {
    return this.multasService.findById(idMultas);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<MultasDto[]> {
    return this.multasService.findAll(params);
  }

  @Put('/:idMulta')
  async update(@Param('idMulta') idMulta: number, @Body() multas: MultasDto) {
    await this.multasService.update(idMulta, multas);
  }

  @Patch('/deletar-multa/:idMultas')
  async softRemove(@Param('idMultas') idMultas: number): Promise<void> {
    return this.multasService.softRemove(idMultas);
  }

  @Delete('/:idMulta')
  remove(@Param('idMulta') idMulta: number) {
    return this.multasService.remove(idMulta);
  }
}
