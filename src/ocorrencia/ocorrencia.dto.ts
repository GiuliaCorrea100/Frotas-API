export class ocorrenciaDto {
  idOcorrencia?: number;
  descricao: string;
  idCorrida?: number;
  //dataRegistro: Date;
  dataOcorrencia: Date;
  ativa?: boolean;
}

export interface FindAllParameters {
  descricao?: string;
  idCorrida?: number;
  dataRegistro?: Date;
}

export class CorridasRouteParameters {
  idOcorrencia: number;
}
