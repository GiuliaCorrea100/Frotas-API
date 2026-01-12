export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  localDeSaida: string;
  idMotorista: number;

  chaveEmprestada: boolean;
  dataHoraRecebimentoChave: Date;
  dataHoraLiberacaoChave: Date;

  idCarro: number;

  nomeMotorista?: string;
  placaVeiculo?: string;
  situacao?: string;
}

export interface MotoristaDashboardDto {
  corridaDeHoje: CorridaDto | null;
  proximasCorridas: CorridaDto[];
}

export interface FindAllParameters {
  localDeSaida: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
