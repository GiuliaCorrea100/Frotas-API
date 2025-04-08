export class AbastecimentoDto {
  idAbastecimento: number;
  litros: number;
  codPagamento: string;
  precoFinal: string;
  tipoCombustivel: string;
  dataAbastecimento: Date;
}

export interface FindAllParameters {
  tipoCombustivel: string;
  dataAbastecimento: Date;
}
