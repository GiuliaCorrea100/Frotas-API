export class OcorrenciasDto {
  idOcorrencia?: number;
  descricao: string;
  idCorrida?: number;
  dataRegistro: Date;
}

export interface FindAllParameters {
  descricao: string;
  idCorrida: number;
  dataRegistro: Date;
}

export class CorridasRouteParameters {
  idOcorrencia: number;
}
