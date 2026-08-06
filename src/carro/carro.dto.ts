export class CarroDto {
  idCarro?: number;
  tombo: number;
  placa: string;
  odometro: string;
  modelo: string;
  ano: number;

  localidadeFisica: string;
  situacao: string;
  ativo: boolean;
  idTipoCombustivel?: number;

  nomeTipoCombustivel?: string;
  urlCrlv?: string;
}

export interface FindAllParameters {
  modelo?: string;
  placa?: string;
  ano?: number;
}

export class CarroRouteParameters {
  idCarro: number;
}
