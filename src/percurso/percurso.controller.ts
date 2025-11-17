import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PercursoDto } from './percurso.dto';
import { PercursoService } from './percurso.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('percurso')
export class PercursoController {
  constructor(private readonly percursoService: PercursoService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() percurso: PercursoDto,
    @Request() req: any,
  ): Promise<PercursoDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.percursoService.create(
      percurso,
      currentUserId,
      currentUserName,
    );
  }

  @Post('percurso-completo/:idCorrida')
  @UseGuards(AuthGuard)
  async inserirPercursoCompleto(
    @Param('idCorrida') idCorrida: number,
    @Body() percurso: PercursoDto,
    @Request() req: any,
  ): Promise<PercursoDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.percursoService.inserirPercursoCompleto(
      idCorrida,
      percurso,
      currentUserId,
      currentUserName,
    );
  }

  @Put(':id/finalizar')
  @UseGuards(AuthGuard)
  async finalizarPercurso(
    @Param('id') id: number,
    @Body() finalizacaoData: { chegadaOdometro: number },
    @Request() req: any,
  ): Promise<PercursoDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.percursoService.finalizarPercurso(
      id,
      finalizacaoData.chegadaOdometro,
      currentUserId,
      currentUserName,
    );
  }

  @Get('corrida/:idCorrida')
  async findByCorrida(
    @Param('idCorrida') idCorrida: number,
  ): Promise<PercursoDto[]> {
    return await this.percursoService.findByCorrida(idCorrida);
  }

  @Get('corrida/:idCorrida/ativo')
  async findUltimoAtivo(
    @Param('idCorrida') idCorrida: number,
  ): Promise<PercursoDto> {
    return await this.percursoService.findUltimoPercursoAtivo(idCorrida);
  }

  @Get('corrida/:idCorrida/ultimo-finalizado')
  async findUltimoFinalizado(
    @Param('idCorrida') idCorrida: number,
  ): Promise<PercursoDto> {
    return await this.percursoService.findUltimoPercursoFinalizado(idCorrida);
  }

  @Get('corrida/:idCorrida/ativos/count')
  async countPercursosAtivos(
    @Param('idCorrida') idCorrida: number,
  ): Promise<number> {
    return await this.percursoService.verificarPercursosAtivos(idCorrida);
  }

  @Patch('/deletar-percurso/:idPercurso')
  @UseGuards(AuthGuard)
  async softRemove(
    @Param('idPercurso') idPercurso: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.percursoService.softRemove(
      idPercurso,
      currentUserId,
      currentUserName,
    );
  }


  @Patch(':id/atualizar-percurso')
  @UseGuards(AuthGuard)
  async updatePercurso(
    @Param('id') id: number,
    @Body() percurso: PercursoDto,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.percursoService.updatePercurso(
      id,
      percurso,
      currentUserId,
      currentUserName,
    );
  }
}
