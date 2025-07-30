export class CorridaDto {
  idCorrida?: number;
  dataInicio: Date;
  dataTermino: Date;
  distanciaKm?: string;
  itinerario: string;
  idMotorista: number;
  situacao: string; //novo atributo

  //true= emprestada(está com motorista)
  //false = não emprestada (não está com o motorista)
  chaveEmprestada: boolean;

  idCarros: number;

  nomeMotorista?: string;
  placaVeiculo?: string;
}

export interface FindAllParameters {
  itinerario: string;
}

export class CorridasRouteParameters {
  idCorrida: number;
}
