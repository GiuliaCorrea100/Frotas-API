export class CnhDto {
  rg: string;
  nome: string;
  sobrenome: string;
  classificacao: string;
  data_emissao: Date;
  data_validade: Date;
}

export interface FindAllParameters {
  nome: string;
  sobrenome: string;
  classificacao: string;
  data_validade: Date;
}
