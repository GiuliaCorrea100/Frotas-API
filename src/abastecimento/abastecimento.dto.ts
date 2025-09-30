export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: number;
  precoFinal: number;
  dataAbastecimento: Date;

  // adicionei as colunas
  valorUnitario: number;
  justificativaAlteracao?: string;

  nomeTipoCombustivel?: string;

  //chave estrangeira
  idTipoCombustivel?: number;
  idCorrida?: number;

  codigoPagamento: string;

  quantidade: number;

  valorTotal: number;
}

export interface FindAllParameters {
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
