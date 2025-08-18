export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  
  idMotorista: number;

  //true= emprestada(está com motorista)
  //false = não emprestada (não está com o motorista)
  chaveEmprestada: boolean;

  idCarros: number;

  nomeMotorista?: string;
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
