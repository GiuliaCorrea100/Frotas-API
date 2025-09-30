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

  @Column({ type: 'int', name: 'id_tipo_combustivel' })
  idTipoCombustivel: number;

  @Column({ type: 'varchar', name: 'codigo_pagamento' })
  codigoPagamento: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_abastecimento',
  })
  dataAbastecimento: Date;

  @Column({ type: 'int', name: 'quantidade' })
  quantidade: number;

  @Column({ type: 'decimal', name: 'valor_unitario' })
  valorUnitario: number;

  @Column({ type: 'decimal', name: 'valor_total' })
  valorTotal: number;

  @Column({ type: 'varchar', name: 'justificativa_alteracao', nullable: true })
  justificativaAlteracao?: string;

  //CHAVE ESTRANGEIRA
  @ManyToOne(() => TipoCombustivelEntity)
  @JoinColumn({ name: 'id_tipo_combustivel' })
  tipoCombustivel?: TipoCombustivelEntity;

  @ManyToOne(() => CorridasEntity)
  @JoinColumn({ name: 'id_corrida' })
  idCorrida: CorridasEntity;
}
