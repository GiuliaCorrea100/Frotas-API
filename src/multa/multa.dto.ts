export class MultaDto {
  idMulta?: number;
  codigoInfracao: number;
  classificacao: string;
  valorInfracao: number;
  placaVeiculo: string;
  dataInfracao: Date;
  autoInfracao: number;
  ativa?: boolean;
  idMotorista?: number;
  nomeMotorista?: string;
  urlArquivo?: string;
  motorista?: {
    idUsuario?: number;
    nome?: string;
    email?: string;
  };
}

export interface FindAllParameters {
  codigoInfracao?: number;
  classificacao?: string;
  valorInfracao?: number;
  placaVeiculo?: string;
  dataInfracao?: Date;
}

export class MultaRouteParameters {
  idMulta: number;
}