import { CorridasEntity } from 'src/db/entities/corrida.entity';
import { TipoCombustivelEntity } from 'src/db/entities/tipoCombustivel.entity';

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
  justificativaAlteracao?: string;

  //chave estrangeira
  tipo_combustivel: TipoCombustivelEntity;
  corrida: CorridasEntity;
}

export interface FindAllParameters {
  dataAbastecimento: Date;
}

export class AbastecimentoRouteParameters {
  idAbastecimento: number;
}
