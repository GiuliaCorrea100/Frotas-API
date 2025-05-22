import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbastecimentoEntity } from './abastecimento.entity';

@Entity({ name: 'corridas' })
export class CorridasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida' })
  idCorrida?: number;

  @OneToMany(() => AbastecimentoEntity, abastecimento => abastecimento.id_corrida)
abastecimentos: AbastecimentoEntity[];


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

   @Column({ type: 'varchar', name: 'motorista' })
  motorista: string;
}
