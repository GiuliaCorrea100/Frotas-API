export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  localDeSaida: string;
  idMotoristaPrincipal: number;

  chaveEmprestada: boolean;
  dataHoraRecebimentoChave: Date;
  dataHoraLiberacaoChave: Date;

  idMotoristaRetirada?: number;
  nomeMotoristaRetirada?: string;
  idMotoristaDevolucao?: number;
  nomeMotoristaDevolucao?: string;

  idCarro: number;

  nomeMotoristaPrincipal?: string;
  placaVeiculo?: string;
  situacao?: string;

  motoristasIds?: number[];
  motoristas?: { idMotorista: number; nome: string }[];
}

export interface MotoristaDashboardDto {
  corridaDeHoje: CorridaDto | null;
  proximasCorridas: CorridaDto[];
}

export interface FindAllParameters {
  localDeSaida?: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
