import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'multa' })
export class MultaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_multa' })
  idMulta?: number;

  @Column({ type: 'int', name: 'codigo_infracao' })
  codigoInfracao: number;

  @Column({ type: 'varchar', name: 'classificacao' })
  classificacao: string;

  @Column({ type: 'decimal', name: 'valor_infracao' })
  valorInfracao: number;

  @Column({ type: 'boolean', name: 'ativa' })
  ativa?: boolean;

  @Column({ type: 'varchar', name: 'placa_veiculo' })
  placaVeiculo: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_infracao',
  })
  dataInfracao: Date;

  @Column({ type: 'int', name: 'num_auto_infracao' })
  autoInfracao: number;
}
