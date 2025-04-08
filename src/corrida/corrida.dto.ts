export class CorridaDto {
  idCorrida: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm: string;
  itinerario: string;
}

export interface FindAllParameters {
  itinerario: string;
}
