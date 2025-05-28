export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: string;
  precoFinal: string;
  tipoCombustivel: string;
  dataAbastecimento: Date;

  valorUnitarioLitro: number;
  valorMedioLitro: number;
  valorUnitario: number;
  valorMedio: number;
  justificativaAlteracao?: string;
}

export interface FindAllParameters {
  tipoCombustivel: string;
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
