export class CarrosDto {
  id: string; //mudar, provalmente vai ser o valor do qrcode
  placa: string;
  odometro: string;
  modelo: string;
  ano: string;
}

export interface FindAllParameters {
  modelo: string;
  ano: string;
}
