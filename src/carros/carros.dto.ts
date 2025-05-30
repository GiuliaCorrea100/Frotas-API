export class CarrosDto {
  idCarros?: number;
  tombo: number;
  qrCode: string;
  placa: string;
  odometro: string;
  modelo: string;
  ano: number;
  
  //adicionei as colunas
  localidade_fisica : string;
  situacao: string;

}

export interface FindAllParameters {
  modelo: string;
  ano: number;
}

export class CarrosRouteParameters {
  idCarros: number;
}
