export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  itinerario: string;
  tomboCarro: string;
  numeroIdMotorista: number;
  nomeMotorista?: string;
}

export interface FindAllParameters {
  itinerario: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
