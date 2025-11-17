import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'percurso' })
export class PercursoEntity {
  @PrimaryGeneratedColumn({ name: 'id_percurso' })
  idPercurso?: number;

  @Column({ name: 'id_corrida', nullable: false })
  idCorrida: number;

  @Column({ type: 'timestamptz', name: 'saida_hora' })
  saidaHora: Date;

  @Column({ name: 'saida_odometro', type: 'numeric', precision: 10, scale: 2 })
  saidaOdometro: number;

  @Column({ name: 'local_destino' })
  localDestino: string;

  @Column({ type: 'timestamptz', name: 'chegada_hora', nullable: true })
  chegadaHora?: Date;

  @Column({ type: 'boolean', name: 'ativo' })
  ativo: boolean;

  @Column({
    name: 'chegada_odometro',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  chegadaOdometro?: number;

  @Column({ name: 'local_origem', nullable: true })
  localOrigem?: string;
}
