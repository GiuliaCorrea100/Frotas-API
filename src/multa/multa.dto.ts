export class MultaDto {
  idMulta?: number;
  codigoInfracao: number;
  classificacao: string;
  valorInfracao: number;
  placaVeiculo: string;
  dataInfracao: Date;
  autoInfracao: string;
  modeloVeiculo?: string;
  situacao?: string;
  motivoReprovacao?: string;
  ativa?: boolean;
  idMotorista?: number;
  nomeMotorista?: string;
  possuiRecurso?: boolean;
  urlArquivo?: string;
  urlComprovantePagamento?: string;
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