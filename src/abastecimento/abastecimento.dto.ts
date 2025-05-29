export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: number;
  precoFinal: number;
  dataAbastecimento: string;

  valorUnitarioLitro: number;
  valorMedioLitro: number;
  valorUnitario: number;
  valorMedio: number;
  justificativaAlteracao?: string;

  //chave estrangeira
  //idTipoCombustivel: number;
}

export interface FindAllParameters {
  tipoCombustivel: string;
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
