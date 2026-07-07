export class PercursoDto {
  idPercurso?: number;
  idCorrida: number;
  saidaHora?: Date;
  saidaOdometro: number;
  localDestino: string;
  chegadaHora?: Date;
  chegadaOdometro?: number;
  localOrigem?: string;
  ativo?: boolean;
  idMotorista?: number;
  nomeMotorista?: string;
}

export class CreatePercursoDto {
  idCorrida: number;
  saidaOdometro: number;
  localDestino: string;
  localOrigem?: string;
  idMotorista?: number;
}
