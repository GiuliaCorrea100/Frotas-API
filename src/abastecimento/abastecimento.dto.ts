export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: string;
  precoFinal: number;
  dataAbastecimento: Date;

}

export interface FindAllParameters {
  tipoCombustivel: string;
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
