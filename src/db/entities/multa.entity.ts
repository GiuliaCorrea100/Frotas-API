import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { RecursoEntity } from './recurso.entity';

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

  @Column({
    type: 'timestamp without time zone',
    name: 'data_infracao',
  })
  dataInfracao: Date;

  @Column({ type: 'varchar', name: 'num_auto_infracao' })
  autoInfracao: string;

  @Column({ type: 'varchar', name: 'situacao', nullable: true })
  situacao?: string;

  @Column({ type: 'varchar', name: 'motivo_reprovacao', nullable: true })
  motivoReprovacao?: string;

  @Column({ type: 'varchar', name: 'url_arquivo', nullable: true })
  urlArquivo?: string;

  @Column({
    type: 'varchar',
    name: 'url_comprovante_pagamento',
    nullable: true,
  })
  urlComprovantePagamento?: string;

  @Column({ type: 'int', name: 'id_motorista', nullable: true })
  idMotorista?: number;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'id_motorista', referencedColumnName: 'idUsuario' })
  motorista?: UsuarioEntity;

  @OneToOne(() => RecursoEntity, (recurso) => recurso.multa)
  recurso?: RecursoEntity;
}