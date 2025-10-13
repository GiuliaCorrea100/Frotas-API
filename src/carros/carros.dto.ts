export class CarrosDto {
  idCarro?: number;
  tombo: number;
  qrCode: string;
  placa: string;
  odometro: string;
  modelo: string;
  ano: number;

  localidadeFisica: string;
  situacao: string;
  ativo: boolean;
  idTipoCombustivel?: number;

  nomeTipoCombustivel?: string;
}

export interface FindAllParameters {
  modelo: string;
  ano: number;
}

export class CarrosRouteParameters {
  idCarro: number;
}
