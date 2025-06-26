import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';

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

  @Column({ type: 'varchar', name: 'tombo_carro', nullable: false })
  tomboCarro: string;

  @Column({ type: 'int', name: 'id_carros', nullable: false })
  idCarros: number;

  @ManyToOne(() => UserSinguEntity)
  @JoinColumn({ name: 'numero_idmotorista', referencedColumnName: 'idPessoa' })
  motorista?: UserSinguEntity;
}
