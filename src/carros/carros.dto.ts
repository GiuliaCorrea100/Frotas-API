export class CarrosDto {
<<<<<<< HEAD
  id: string; //mudar dps
  placa: string;
  odometro: string;
  modelo: string;
  ano: string;
=======
  idCarros?: number;
  tombo: number;
  qrCode: string;
  placa: string;
  odometro: string;
  modelo: string;
  ano: number;
>>>>>>> e833801 (adc no gitlab)
}

export interface FindAllParameters {
  modelo: string;
<<<<<<< HEAD
  ano: string;
=======
  ano: number;
}

export class CarrosRouteParameters {
  idCarros: number;
>>>>>>> e833801 (adc no gitlab)
}
