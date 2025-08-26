import { Body, Controller, Post } from '@nestjs/common';
import { PercursoDto } from './percurso.dto';
import { PercursoService } from './percurso.service';

@Controller('percurso')
export class PercursoController {
  constructor(private readonly percursoService: PercursoService) {}

  @Post()
  async create(@Body() percurso: PercursoDto): Promise<PercursoDto> {
    return await this.percursoService.create(percurso);
  }
}