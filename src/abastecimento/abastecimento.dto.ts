export class AbastecimentoDto {
  idAbastecimento?: number;

  //chave estrangeira
  idTipoCombustivel?: number;
  idCorrida?: number;

  codigoPagamento: string;
  dataAbastecimento: Date;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  ativo?: boolean;

  nomeTipoCombustivel?: string;
}

export interface FindAllParameters {
  dataAbastecimento?: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
