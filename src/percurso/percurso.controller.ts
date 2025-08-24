import { Body, Controller, Post, Put, HttpException, HttpStatus, Param, Get } from '@nestjs/common';
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
        error: 'Ocorreu um erro ao criar o percurso',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/finalizar')
  async finalizarPercurso(
    @Param('id') id: number,
    @Body() finalizacaoData: { chegadaOdometro: number }
  ): Promise<PercursoDto> {
    try {
      return await this.percursoService.finalizarPercurso(id, finalizacaoData.chegadaOdometro);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Ocorreu um erro ao finalizar o percurso',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('corrida/:idCorrida')
  async findByCorrida(@Param('idCorrida') idCorrida: number): Promise<PercursoDto[]> {
    try {
      return await this.percursoService.findByCorrida(idCorrida);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Ocorreu um erro desconhecido ao buscar o percurso',
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get('corrida/:idCorrida/ativo')
  async findUltimoAtivo(@Param('idCorrida') idCorrida: number): Promise<PercursoDto> {
    try {
      const percurso = await this.percursoService.findUltimoPercursoAtivo(idCorrida);
      if (!percurso) {
        throw new Error('Nenhum percurso ativo encontrado');
      }
      return percurso;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Ocorreu um erro desconhecido ao buscar o percurso ativo',
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get('corrida/:idCorrida/ativos/count')
  async countPercursosAtivos(@Param('idCorrida') idCorrida: number): Promise<number> {
    try {
      return await this.percursoService.verificarPercursosAtivos(idCorrida);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocorreu um erro desconhecido',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}