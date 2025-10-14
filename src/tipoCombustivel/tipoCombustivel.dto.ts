export class TipoCombustivelDto {
  idTipoCombustivel?: number;
  nome: string;
}

export interface FindAllTipoCombustivelParams {
  nome?: string;
}

export class TipoCombustivelRouteParams {
  idTipoCombustivel: number;
}
