import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserSinguEntity } from 'src/db/entities/usersingu.entity';
import { CarrosEntity } from '../../db/entities/carros.entity';

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

  @Column({ type: 'int', name: 'id_carros', nullable: false })
  idCarros: number;

  @ManyToOne(() => UserSinguEntity)
  @JoinColumn({ name: 'numero_idmotorista', referencedColumnName: 'idPessoa' })
  motorista?: UserSinguEntity;

  @ManyToOne(() => CarrosEntity)
  @JoinColumn({ name: 'id_carros', referencedColumnName: 'idCarros' }) // name: coluna nesta tabela; referencedColumnName: coluna na tabela de Carros
  carro?: CarrosEntity;
}
