export class MultaDto {
  idMulta?: number;
  codigoInfracao: number;
  classificacao: string;
  valorInfracao: number;
  placaVeiculo: string;
  dataInfracao: Date;
  autoInfracao: number;
  ativa?: boolean;
  deletada: any;
  idMotorista?: number;
  nomeMotorista?: string;
}

export interface FindAllParameters {
  codigoInfracao: number;
  classificacao: string;
  valorInfracao: number;
  placaVeiculo: string;
  dataInfracao: Date;
}

export class MultaRouteParameters {
  idMulta: number;
}
