import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'multas' })
export class MultasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_multa' })
  idMultas?: number;

  @Column({ type: 'varchar', name: 'cod_infracao' })
  codInfracao: string;

  @Column({ type: 'varchar', name: 'class_infracao' })
  classInfracao: string;

  @Column({ type: 'varchar', name: 'valor' })
  valor: string;

  @Column({ type: 'varchar', name: 'placa' })
  placaVeiculo: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_infracao',
  })
  data: Date;

  @Column({ type: 'int', name: 'num_auto_infracao' })
  numAutoInfracao: number;
}
