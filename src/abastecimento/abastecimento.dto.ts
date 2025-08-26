
export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: number;
  precoFinal: number;
  dataAbastecimento: string;

  // adicionei as colunas
  valorUnitarioLitro: number;
  valorMedioLitro: number;
  valorUnitario: number;
  valorMedio: number;
  justificativaAlteracao?: string;

  //chave estrangeira
  id_tipo_combustivel?: number;
  id_corrida?: number;
}

export interface FindAllParameters {
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
