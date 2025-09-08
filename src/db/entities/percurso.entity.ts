import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'percurso' })
export class PercursoEntity {
  @PrimaryGeneratedColumn({ name: 'id_percurso' })
  idPercurso?: number;

  @Column({ name: 'id_corrida', nullable: false })
  idCorrida: number;

  @Column({ name: 'saida_hora' })
  saidaHora: Date;

  @Column({ name: 'saida_odometro', type: 'numeric', precision: 10, scale: 2 })
  saidaOdometro: number;

  @Column({ name: 'local_destino' })
  localDestino: string;

  @Column({ name: 'chegada_hora', nullable: true })
  chegadaHora?: Date;

  @Column({
    name: 'chegada_odometro',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  chegadaodometro?: number;

  @Column({ name: 'local_origem', nullable: true })
  localOrigem?: string;
}
