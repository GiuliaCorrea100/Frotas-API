export class MultasDto {
  idMultas: number;
  codInfracao: string;
  classInfracao: string;
  valor: string;
  placaVeiculo: string;
  data: Date;
  numAutoInfracao: number;
}

export interface FindAllParameters {
  codInfracao: string;
  classInfracao: string;
  valor: string;
  data: Date;
}
