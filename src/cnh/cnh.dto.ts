export class CnhDto {
  id: number;
  nome: string;
  classificacao: string;
  data_emissao: Date;
  data_validade: Date;
}

export interface FindAllParameters {
  nome: string;
  classificacao: string;
  data_validade: Date;
}
