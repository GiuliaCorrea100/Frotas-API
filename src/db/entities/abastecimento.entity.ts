import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'abastecimento' })
export class AbastecimentoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_abastecimento' })
  idAbastecimento?: number;

  @Column({ type: 'int', name: 'litros' })
  litros: number;

  @Column({ type: 'varchar', name: 'cod_pagamento' })
  codPagamento: string;

  @Column({ type: 'varchar', name: 'precoFinal' })
  precoFinal: string;

  @Column({ type: 'varchar', name: 'tipo_combustivel' })
  tipoCombustivel: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_abastecimento',
  })
  dataAbastecimento: Date;
}
