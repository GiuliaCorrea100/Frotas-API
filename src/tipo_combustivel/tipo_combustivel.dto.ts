export class TipoCombustivelDto {
  tipo_combustivel_id?: number;
  nome: string;
}

export interface FindAllTipoCombustivelParams {
  nome?: string; 
}

export class TipoCombustivelRouteParams {
  tipo_combustivel_id: number;
}
