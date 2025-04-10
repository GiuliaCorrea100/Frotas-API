export class CarrosDto {
  idCarros?: number;
  tombo: number;
  qrCode: string;
  placa: string;
  odometro: string;
  modelo: string;
  ano: number;
}

export interface FindAllParameters {
  modelo: string;
  ano: number;
}
