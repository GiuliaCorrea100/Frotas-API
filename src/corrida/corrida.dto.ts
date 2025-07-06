export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  itinerario: string;
  idMotorista: number;
  nomeMotorista?: string;
  idCarros: number;
  placaVeiculo?: string;
  situacao?: string;
}

export interface MotoristaDashboardDto {
  corridaDeHoje: CorridaDto | null;
  proximasCorridas: CorridaDto[];
}

export interface FindAllParameters {
  itinerario: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
