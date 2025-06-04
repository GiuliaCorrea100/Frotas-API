import { TipoCombustivelEntity } from "src/db/entities/tipoCombustivel.entity";

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
  tipo_combustivel: TipoCombustivelEntity;

}

export interface FindAllParameters {
  modelo: string;
  ano: number;
}

export class CarrosRouteParameters {
  idCarros: number;
}
