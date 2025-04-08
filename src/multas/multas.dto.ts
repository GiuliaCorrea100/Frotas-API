export class MultasDto {
  id: number;
  codInfracao: string;
  classInfracao: string;
  valor: string;
  placa_veiculo: string;
  data: Date;
  num_auto_infracao: number;
}

export interface FindAllParameters {
  cod_infracao: string;
  class_infracao: string;
  valor: string;
  placa_veiculo: string;
  data: Date;
}
