export class TipoCombustivelDto {
  id_tipo_combustivel?: number;
  nome: string;
}

export interface FindAllTipoCombustivelParams {
  nome?: string;
}

export class TipoCombustivelRouteParams {
  id_tipo_combustivel: number;
}
