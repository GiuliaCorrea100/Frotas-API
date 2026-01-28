import { Injectable } from '@nestjs/common';
import { AbastecimentoService } from 'src/abastecimento/abastecimento.service';
import { carroService } from 'src/carro/carro.service';
import { CorridaService } from 'src/corrida/corrida.service';
import { MultaService } from 'src/multa/multa.service';
import { ocorrenciaService } from 'src/ocorrencia/ocorrencia.service';

@Injectable()
export class RelatorioService {
  constructor(
    private readonly corridaService: CorridaService,
    private readonly carroService: carroService,
    private readonly abastecimentoService: AbastecimentoService,
    private readonly multaService: MultaService,
    private readonly ocorrenciaService: ocorrenciaService,
  ) {}

  async getVisaoGeral(ano: number) {
    const inicio = new Date(ano, 0, 1, 0, 0, 0);
    const fim = new Date(ano, 11, 31, 23, 59, 59);

    const corridas = await this.corridaService.findByAno(ano);

    const [carros, abastecimentos, multas, ocorrencias] = await Promise.all([
      this.carroService.findAll({}),
      this.abastecimentoService.findAll({}),
      this.multaService.findAll({}),
      this.ocorrenciaService.findAll({}),
    ]);

    const filtrarPorAno = (data: Date | string | null | undefined) => {
      if (!data) return false;
      return new Date(data).getFullYear() === ano;
    };

    const corridasAno = corridas.filter((c) => filtrarPorAno(c.dataInicio));
    const abastecimentosAno = abastecimentos.filter((a) =>
      filtrarPorAno(a.dataAbastecimento),
    );
    const multasAno = multas.filter((m) => filtrarPorAno(m.dataInfracao));
    const ocorrenciasAno = ocorrencias.filter((o) =>
      filtrarPorAno(o.dataOcorrencia),
    );

    const totalGastoCombustivel = abastecimentosAno.reduce(
      (soma, a) => soma + Number(a.valorTotal || 0),
      0,
    );

    return {
      totalCorridas: corridasAno.length,
      totalVeiculos: carros.length,
      totalGastoCombustivel,
      totalMultas: multasAno.length,
      totalOcorrencias: ocorrenciasAno.length,
    };
  }

  async getCorridas(ano: number): Promise<{
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
    const inicio = new Date(ano, 0, 1, 0, 0, 0);
    const fim = new Date(ano, 11, 31, 23, 59, 59);

    // Buscar corridas do ano
    const corridas = await this.corridaService.findByAno(ano);

    const totalCorridas = corridas.length;

    // Resumo por situação
    const mapaSituacao: Record<string, number> = {};
    for (const c of corridas) {
      const sit = c.situacao || 'N/A';
      mapaSituacao[sit] = (mapaSituacao[sit] || 0) + 1;
    }
    const porSituacao = Object.entries(mapaSituacao).map(
      ([situacao, quantidade]) => ({
        situacao,
        quantidade,
      }),
    );

    // Desempenho dos motoristas - ranking
    const mapaMotoristas = new Map<
      number | null,
      { idMotorista: number | null; nome: string; corridas: number }
    >();

    for (const c of corridas) {
      const id = c.motorista?.idUsuario ?? null;
      const nome = c.motorista?.nome ?? 'N/A';

      const atual = mapaMotoristas.get(id) ?? {
        idMotorista: id,
        nome,
        corridas: 0,
      };
      atual.corridas++;
      mapaMotoristas.set(id, atual);
    }

    const desempenhoMotoristas = Array.from(mapaMotoristas.values())
      .sort((a, b) => b.corridas - a.corridas)
      .slice(0, 10);

    // Tabela detalhada
    const tabela = corridas.map((c) => ({
      id: c.idCorrida,
      motorista: c.motorista?.nome ?? c.motorista.nome ?? 'N/A',
      veiculo: c.carro?.placa ?? c.carro.placa ?? 'N/A',
      situacao: c.situacao ?? 'N/A',
      dataInicio: c.dataInicio?.toISOString(),
      dataTermino: c.dataTermino?.toISOString() ?? null,
      localSaida: c.localDeSaida ?? null,
    }));

    return {
      resumo: {
        totalCorridas,
        porSituacao,
      },
      desempenhoMotoristas,
      tabela,
    };
  }

  async getVeiculos(ano: number): Promise<{
    resumo: {
      totalVeiculos: number;
      emOperacao: number;
      emManutencao: number;
      ociosos: number;
    };
    situacaoFrota: { situacao: string; quantidade: number }[];
    desempenhoVeiculos: { veiculo: string; corridas: number }[];
    tabela: {
      id: number | string;
      placa: string;
      modelo: string;
      situacao: string;
      localidadeFisica: string;
      totalCorridas: number;
      statusUtilizacao: 'Normal' | 'Ocioso' | 'Superutilizado';
    }[];
  }> {
    // Buscar carros (frota)
    const carros = await this.carroService.findAll({
      modelo: '',
      placa: '',
    });

    // Buscar corridas do ano (para uso/ociosidade)
    const corridasAno = await this.corridaService.findByAno(ano);

    // Resumo por situação
    const situacaoCounts = carros.reduce((acc: Record<string, number>, c) => {
      const situacao = c.situacao || 'INDEFINIDA';
      acc[situacao] = (acc[situacao] || 0) + 1;
      return acc;
    }, {});

    const situacaoFrota = Object.entries(situacaoCounts).map(
      ([situacao, quantidade]) => ({
        situacao,
        quantidade,
      }),
    );

    const totalVeiculos = carros.length;
    const emOperacao =
      (situacaoCounts['RESERVADO'] || 0) + (situacaoCounts['VIAGEM'] || 0);
    const emManutencao = situacaoCounts['MANUTENCAO'] || 0;

    // Mapa de corridas por veículo
    const corridasPorVeiculo = corridasAno.reduce(
      (acc: Record<number, number>, c: any) => {
        const idCarro = c.veiculo?.idCarro || c.idCarro;
        if (!idCarro) return acc;
        acc[idCarro] = (acc[idCarro] || 0) + 1;
        return acc;
      },
      {},
    );

    const desempenhoVeiculos = Object.entries(corridasPorVeiculo)
      .map(([idCarroStr, corridas]) => {
        const idCarro = Number(idCarroStr);
        const veiculo = carros.find((v: any) => v.idCarro === idCarro);
        const placa = veiculo?.placa || 'N/A';
        return { veiculo: placa, corridas };
      })
      .sort((a, b) => b.corridas - a.corridas)
      .slice(0, 10);

    // Tabela detalhada + cálculo de ociosos
    const tabela = carros.map((v: any) => {
      const totalCorridas = corridasPorVeiculo[v.idCarro] || 0;

      let statusUtilizacao: 'Normal' | 'Ocioso' | 'Superutilizado' = 'Normal';
      if (totalCorridas === 0 && v.situacao === 'DISPONIVEL') {
        statusUtilizacao = 'Ocioso';
      } else if (totalCorridas > 20) {
        statusUtilizacao = 'Superutilizado';
      }

      return {
        id: v.idCarro,
        placa: v.placa,
        modelo: v.modelo || 'N/A',
        situacao: v.situacao || 'N/A',
        localidadeFisica: v.localidadeFisica || 'N/A',
        totalCorridas,
        statusUtilizacao,
      };
    });

    const ociosos = tabela.filter(
      (row) => row.statusUtilizacao === 'Ocioso',
    ).length;

    return {
      resumo: {
        totalVeiculos,
        emOperacao,
        emManutencao,
        ociosos,
      },
      situacaoFrota,
      desempenhoVeiculos,
      tabela,
    };
  }

  async getAbastecimentos(ano: number) {
    // buscar abastecimentos do ano
    const abastecimentos = await this.abastecimentoService.findByAno(ano);

    // Total (litros e valor)
    const totalLitros = abastecimentos.reduce(
      (acc, a) => acc + (Number(a.quantidade) || 0),
      0,
    );

    const totalValor = abastecimentos.reduce(
      (acc, a) => acc + (Number(a.valorTotal) || 0),
      0,
    );

    // Custo por tipo de combustível
    const custoPorCombustivelMap: Record<string, number> = {};
    for (const a of abastecimentos) {
      const tipo = a.tipoCombustivel?.nome || 'Não especificado';
      custoPorCombustivelMap[tipo] =
        (custoPorCombustivelMap[tipo] || 0) + (Number(a.valorTotal) || 0);
    }
    const custoPorCombustivel = Object.entries(custoPorCombustivelMap).map(
      ([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }),
    );

    // Consumo mensal (litros e valor)
    const meses = Array.from({ length: 12 }, (_, i) => i);
    const consumoMensal = meses.map((mes) => {
      let litros = 0;
      let valor = 0;
      for (const a of abastecimentos) {
        const data = new Date(a.dataAbastecimento);
        if (data.getFullYear() === ano && data.getMonth() === mes) {
          litros += Number(a.quantidade) || 0;
          valor += Number(a.valorTotal) || 0;
        }
      }
      const nomeMes = new Date(0, mes).toLocaleString('pt-BR', {
        month: 'short',
      });
      const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
      return {
        mes: mesFormatado,
        Litros: Number(litros.toFixed(2)),
        Valor: Number(valor.toFixed(2)),
      };
    });

    // Consumo por campus (localidade_fisica do veículo)
    const consumoPorCampusMap: Record<
      string,
      { litros: number; valor: number }
    > = {};
    for (const a of abastecimentos) {
      const campus = a.corrida?.carro?.localidadeFisica || 'Não especificado';
      if (!consumoPorCampusMap[campus]) {
        consumoPorCampusMap[campus] = { litros: 0, valor: 0 };
      }
      consumoPorCampusMap[campus].litros += Number(a.quantidade) || 0;
      consumoPorCampusMap[campus].valor += Number(a.valorTotal) || 0;
    }
    const consumoPorCampus = Object.entries(consumoPorCampusMap)
      .map(([campus, { litros, valor }]) => ({
        campus,
        litros: Number(litros.toFixed(2)),
        valor: Number(valor.toFixed(2)),
      }))
      .sort((a, b) => b.litros - a.litros);

    return {
      resumo: {
        totalLitros,
        totalValor,
      },
      custoPorCombustivel,
      consumoMensal,
      consumoPorCampus,
    };
  }

  // relatorio.service.ts → getMultas
  async getMultas(ano: number) {
    const multas = await this.multaService.findByAno(ano);

    const totalMultas = multas.length;

    const multasPorClassificacao = await this.multaService.groupByClassificacao(
      multas,
      'classificacao',
    );

    const multasPorVeiculoRaw = await this.multaService.groupByClassificacao(
      multas,
      'placaVeiculo',
      'N/A',
    );
    const multasPorVeiculo = multasPorVeiculoRaw.sort(
      (a, b) => b.quantidade - a.quantidade,
    );

    const meses = Array.from({ length: 12 }, (_, i) => i);
    const multasPorMes = meses.map((mes) => {
      let quantidade = 0;
      for (const m of multas) {
        if (!m.dataInfracao) continue;
        const data = new Date(m.dataInfracao);
        if (data.getFullYear() === ano && data.getMonth() === mes) {
          quantidade++;
        }
      }
      const nomeMes = new Date(0, mes).toLocaleString('pt-BR', {
        month: 'short',
      });
      const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
      return {
        mes: mesFormatado,
        quantidade,
      };
    });

    return {
      resumo: { totalMultas },
      multasPorClassificacao,
      multasPorVeiculo,
      multasPorMes,
    };
  }

  async getOcorrencias(ano: number) {
    // Buscar ocorrências do ano com joins
    const ocorrencias = await this.ocorrenciaService.findByAno(ano);

    // Ocorrências por veículo
    const ocorrenciasPorVeiculoMap: Record<string, number> = {};
    for (const o of ocorrencias) {
      const placa = o.corrida?.carro?.placa || 'N/A';
      ocorrenciasPorVeiculoMap[placa] =
        (ocorrenciasPorVeiculoMap[placa] || 0) + 1;
    }
    const ocorrenciasPorVeiculo = Object.entries(ocorrenciasPorVeiculoMap)
      .map(([placa, quantidade]) => ({
        placa,
        quantidade,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      resumo: {
        totalOcorrencias: ocorrencias.length,
      },

      ocorrenciasPorVeiculo,
    };
  }
}
