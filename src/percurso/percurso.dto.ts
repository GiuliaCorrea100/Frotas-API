export class PercursoDto {
  idPercurso?: number;
  idCorrida: number;
  saidaHora?: Date;
  saidaOdometro: number;
  localDestino: string;
  chegadaHora?: Date;
  chegadaodometro?: number;
  localOrigem?: string;
}

export class CreatePercursoDto {
  idCorrida: number;
  saidaOdometro: number;
  localDestino: string;
  localOrigem?: string;
}
