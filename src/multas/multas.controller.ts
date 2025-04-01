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
import { MultasDto, FindAllParameters } from './multas.dto';
import { MultasService } from './multas.service';

@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  @Post()
  create(@Body() multas: MultasDto) {
    this.multasService.create(multas);
  }

  @Get('/:num_auto_infracao')
  findByAutoInfracao(
    @Param('num_auto_infracao') num_auto_infracao: string,
  ): MultasDto {
    return this.multasService.findByAutoInfracao(num_auto_infracao);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): MultasDto[] {
    return this.multasService.findAll(params);
  }

  @Put()
  update(@Body() multas: MultasDto) {
    this.multasService.update(multas);
  }

  @Delete('/:num_auto_infracao')
  remove(@Param('num_auto_infracao') num_auto_infracao: string) {
    return this.multasService.remove(num_auto_infracao);
  }
}
