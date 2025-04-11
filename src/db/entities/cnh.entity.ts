import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cnh' })
export class CnhEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_cnh' })
  idCnh?: number;

  @Column({ type: 'varchar', name: 'nome' })
  nome: string;

  @Column({ type: 'varchar', name: 'classificacao' })
  classificacao: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'data_emissao',
  })
  dataEmissao: Date;

  @CreateDateColumn({
    type: 'time without time zone',
    name: 'data_validade',
  })
  dataValidade: Date;
}
