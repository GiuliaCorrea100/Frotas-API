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

  @Column({ type: 'varchar', name: 'cod_pagamento' })
  codPagamento: string;

  @Column({ type: 'decimal', name: 'preco_final' })
  precoFinal: number;

  @ManyToOne(() => TipoCombustivelEntity, { eager: true })
  @JoinColumn({ name: 'tipo_combustivel_id' })
  tipoCombustivel: TipoCombustivelEntity;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_abastecimento',
  })
  dataAbastecimento: Date;

 @Column('decimal')
  valor_unitario_litro: number;

  @Column('decimal')
  valor_medio_litro: number;

  @Column()
  tipo_combustivel_id: number;

 @ManyToOne(() => CorridasEntity, { eager: true }) 
  @JoinColumn({ name: 'id_corrida' })
  id_corrida: CorridasEntity;

  @Column('decimal')
  valor_unitario: number;

  @Column('decimal')
  valor_medio: number;

  @Column({ nullable: true })
  justificativa_alteracao: string;
}
