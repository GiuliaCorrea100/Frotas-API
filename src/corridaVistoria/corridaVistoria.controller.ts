import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CorridaVistoriaService } from './corridaVistoria.service';
import { CorridaVistoriaDto } from './corridaVistoria.dto';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('corrida-vistoria')
@UseGuards(AuthGuard)
export class CorridaVistoriaController {
  constructor(private readonly corridaVistoriaService: CorridaVistoriaService) {}

  @Post()
  @UseGuards(AuthGuard)
  async criarVistoria(
    @Body() vistoria: CorridaVistoriaDto, 
    @Request() req: any,
  ):Promise<CorridaVistoriaDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.corridaVistoriaService.registrarVistoria(
      vistoria, 
      currentUserId,
      currentUserName,
    );
  }

  // @Post('/com-fotos')
  // @UseGuards

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