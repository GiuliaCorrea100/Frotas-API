export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: string;
  precoFinal: number;
  dataAbastecimento: Date;
  valor_unitario_litro: number;
  valor_medio_litro: number;
  tipo_combustivel_id: number;
  id_corrida: number;
  valor_unitario: number;
  valor_medio: number;
  justificativa_alteracao: string;

}

export interface FindAllParameters {
  tipoCombustivel: string;
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
