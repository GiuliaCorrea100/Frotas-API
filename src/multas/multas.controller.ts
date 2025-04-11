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

  @Put('/idMultas')
  async update(
    @Param() params: MultasRouteParameters,
    @Body() multas: MultasDto,
  ) {
    await this.multasService.update(params.idMultas, multas);
  }

  @Delete('/:idMultas')
  remove(@Param('idMultas') idMultas: number) {
    return this.multasService.remove(idMultas);
  }
}
