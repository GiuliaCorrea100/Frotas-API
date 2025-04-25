export class CarrosDto {
  id: string; //mudar dps
  placa: string;
  odometro: string;
  modelo: string;
  ano: string;
}

export interface FindAllParameters {
  modelo: string;
  ano: string;
}
