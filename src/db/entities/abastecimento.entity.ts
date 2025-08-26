import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoCombustivelEntity } from './tipoCombustivel.entity';
import { CorridasEntity } from './corrida.entity';

@Entity({ name: 'abastecimento' })
export class AbastecimentoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_abastecimento' })
  idAbastecimento?: number;

  @Column({ type: 'int', name: 'litros' })
  litros: number;

  @Column({ type: 'decimal', name: 'cod_pagamento' })
  codPagamento: number;

  @Column({ type: 'decimal', name: 'preco_final' })
  precoFinal: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_abastecimento',
  })
  dataAbastecimento: string;

  @Column({ type: 'decimal', name: 'valor_unitario_litro' })
  valorUnitarioLitro: number;

  @Column({ type: 'decimal', name: 'valor_medio_litro' })
  valorMedioLitro: number;

  @Column({ type: 'decimal', name: 'valor_unitario' })
  valorUnitario: number;

  @Column({ type: 'decimal', name: 'valor_medio' })
  valorMedio: number;

  @Column({ type: 'varchar', name: 'justificativa_alteracao', nullable: true })
  justificativaAlteracao?: string;

  //CHAVE ESTRANGEIRA
  @ManyToOne(() => TipoCombustivelEntity)
  @JoinColumn({ name: 'id_tipo_combustivel' })
  tipo_combustivel: TipoCombustivelEntity;


    @ManyToOne(() =>  CorridasEntity)
    @JoinColumn({ name: 'id_corrida' })
    corrida: CorridasEntity;

}


 