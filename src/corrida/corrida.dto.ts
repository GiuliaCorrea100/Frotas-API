export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  local_de_saida: string;
  idMotorista: number;

  chaveEmprestada: boolean;
  datHoraRecebimentoChave: Date;
  dataHoraLiberacaoChave: Date;

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
  local_de_saida: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
