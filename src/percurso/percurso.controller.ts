import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { PercursoDto } from './percurso.dto';
import { PercursoService } from './percurso.service';

@Controller('percurso')
export class PercursoController {
  constructor(private readonly percursoService: PercursoService) {}

  @Post()
  async create(@Body() percurso: PercursoDto): Promise<PercursoDto> {
    try {
      return await this.percursoService.create(percurso);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Ocorreu um erro desconhecido ao criar o percurso',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}