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

  @Put('/:idMultas')
  async update(
    @Param() params: MultasRouteParameters,
    @Body() multas: MultasDto,
  ) {
    await this.multasService.update(params.idMultas, multas);
  }

  @Patch('/deletar-multa/:idMultas')
  async softRemove(@Param() idMultas: number): Promise<void> {
    return this.multasService.softRemove(idMultas);
  }

  @Delete('/:idMultas')
  remove(@Param('idMultas') idMultas: number) {
    return this.multasService.remove(idMultas);
  }
}
