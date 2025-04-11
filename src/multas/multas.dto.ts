export class MultasDto {
  idMultas?: number;
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
  placaVeiculo: string;
  valor: string;
  data: Date;
}

export class MultasRouteParameters {
  idMultas: number;
}
