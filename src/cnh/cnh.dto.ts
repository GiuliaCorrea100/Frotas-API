export class CnhDto {
  idCnh?: number;
  nome: string;
  classificacao: string;
  dataEmissao: Date;
  dataValidade: Date;
}

export interface FindAllParameters {
  nome: string;
  classificacao: string;
  dataValidade: Date;
}

export class CnhRouteParameters {
  idCnh: number;
}
