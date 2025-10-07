import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'frota', name: 'log_tabelas' })
export class LogEntity {
  @PrimaryGeneratedColumn({ name: 'log_id' })
  logId: number;

  @Column({ name: 'nome_tabela', length: 100 })
  nomeTabela: string;

  @Column({ name: 'id_registro' })
  idRegistro: number;

  @Column({ name: 'operacao', length: 10 })
  operacao: 'INSERT' | 'UPDATE' | 'DELETE';

  @Column({ name: 'dados_antigos', type: 'json', nullable: true })
  dadosAntigos: any;

  @Column({ name: 'dados_novos', type: 'json', nullable: true })
  dadosNovos: any;

  @CreateDateColumn({ name: 'data_hora', type: 'timestamp' })
  dataHora: Date;

  @Column({ name: 'usuario', length: 100, nullable: true })
  usuario: string;

  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  idUsuario: number;
}
