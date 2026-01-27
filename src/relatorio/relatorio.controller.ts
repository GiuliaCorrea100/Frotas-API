import { Controller, Get, Query } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';

@Controller('relatorio')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  //Aba de Visão Geral
  @Get('visao-geral')
  async getVisaoGeral(@Query('ano') anoStr: number) {
    const ano = Number(anoStr) || new Date().getFullYear();
    return this.relatorioService.getVisaoGeral(ano);
  }

  //Aba de Corrida
  @Get('corridas')
  async getCorridas(@Query('ano') anoStr: number): Promise<{
    resumo: {
      totalCorridas: number;
      porSituacao: { situacao: string; quantidade: number }[];
    };
    desempenhoMotoristas: {
      idMotorista: number | null;
      nome: string;
      corridas: number;
    }[];
    tabela: {
      id: number;
      motorista: string;
      veiculo: string;
      situacao: string;
      dataInicio: string;
      dataTermino: string | null;
      localSaida: string | null;
    }[];
  }> {
    const ano = Number(anoStr) || new Date().getFullYear();
    return this.relatorioService.getCorridas(ano);
  }

  //Aba de Veículos
  @Get('veiculos')
  async getVeiculos(@Query('ano') anoStr: number) {
    const ano = Number(anoStr) || new Date().getFullYear();
    return this.relatorioService.getVeiculos(ano);
  }

  // Aba de Abastecimentos
  @Get('abastecimentos')
  async getAbastecimentos(@Query('ano') anoStr?: string) {
    const ano = Number(anoStr) || new Date().getFullYear();
    return this.relatorioService.getAbastecimentos(ano);
  }

  // Aba de Multas
  // @Get('multas')
  // async getMultas(@Query('ano') anoStr?: string) {
  //   const ano = Number(anoStr) || new Date().getFullYear();
  //   return this.relatorioService.getMultas(ano);
  // }

  // Aba de Ocorrências
  @Get('ocorrencias')
  async getOcorrencias(@Query('ano') anoStr?: string) {
    const ano = Number(anoStr) || new Date().getFullYear();
    return this.relatorioService.getOcorrencias(ano);
  }
}
