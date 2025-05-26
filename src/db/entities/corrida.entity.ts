import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'corridas' })
export class CorridasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida' })
  idCorrida?: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'data_inicio',
  })
  dataInicio: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'data_termino',
  })
  dataTermino: Date;

  @Column({ type: 'varchar', name: 'distancia_km' })
  distanciaKm: string;

  @Column({ type: 'varchar', name: 'itinerario' })
  itinerario: string;
}
