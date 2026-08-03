/* eslint-disable prettier/prettier */
export class ocorrenciaDto {
  idOcorrencia?: number;
  descricao: string;
  idCorrida?: number;
  //dataRegistro: Date;
  dataOcorrencia: Date;
  ativa?: boolean;
  idMotorista?: number;
  nomeMotorista?: string;
  //enviadoMotorista: boolean;
}

export class OcorrenciaArquivoDto {
  idOcorrenciaArquivo?: number;
  idOcorrencia: number;
  urlArquivo?: string;
  dataUpload?: Date;
}

export interface FindAllParameters {
  descricao?: string;
  idCorrida?: number;
  dataRegistro?: Date;
}

export class CorridasRouteParameters {
  idOcorrencia: number;
}
