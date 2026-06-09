import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CreateCorridaVistoriaDto } from './corridaVistoria.dto';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('corrida-vistoria')
@UseGuards(AuthGuard)
export class CorridaVistoriaController {
  constructor(private readonly corridaVistoriaService: CorridaVistoriaService) {}

  @Post()
  async criarVistoria(@Body() dto: CreateCorridaVistoriaDto, @Request() req: any) {
    const idUsuarioLogado = req.user.idUsuario || req.user.sub;
    return await this.corridaVistoriaService.registrarVistoria(dto, idUsuarioLogado);
  }

  @Get('corrida/:idCorrida')
  async buscarPorCorrida(@Param('idCorrida') idCorrida: number) {
    return await this.corridaVistoriaService.buscarPorCorrida(idCorrida);
  }

  @Get('status-pendente/:idCorrida')
  async verificarStatus(@Param('idCorrida') idCorrida: string) {
    return await this.corridaVistoriaService.verificarVistoriaPendente(
      Number(idCorrida),
    );
  }
}