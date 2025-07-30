export class OcorrenciasDto {
  idOcorrencia?: number;
  descricao: string;
  idCorrida?: number;
}

export interface FindAllParameters {
  descricao: string;
  idCorrida: number;
}

export class CorridasRouteParameters {
  idOcorrencia: number;
}
