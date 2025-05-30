import { CorridasEntity } from "src/db/entities/corrida.entity";
import { TipoCombustivelEntity } from "src/db/entities/tipoCombustivel.entity";

export class AbastecimentoDto {
  idAbastecimento?: number;
  litros: number;
  codPagamento: number;
  precoFinal: number;
  dataAbastecimento: string;

  // adicionei as colunas 
  valorUnitarioLitro: number;
  valorMedioLitro: number;
  valorUnitario: number;
  valorMedio: number;

  //chave estrangeira

  justificativaAlteracao?: string;
  tipo_combustivel: TipoCombustivelEntity;
  corrida: CorridasEntity
 // idTipoCombustivel: number;
  //idCorrida: number;
}

export interface FindAllParameters {
 // tipoCombustivel: string;
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
