export class AbastecimentoDto {
  id: number;
  Litros: number;
  cod_pagamento: string;
  preco_final: string;
  tipo_combustivel: string;
  data_abastecimento: Date;
}

export interface FindAllParameters {
  tipo_combustivel: string;
  data_abastecimento: Date;
}
