import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CorridaEntity } from './corrida.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity({ name: 'corrida_motorista' })
export class CorridaMotoristaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_motorista_corrida' })
  idMotoristaCorrida: number;

  @Column({ type: 'int', name: 'id_corrida' })
  idCorrida: number;

  @Column({ type: 'int', name: 'id_motorista' })
  idMotorista: number;

  //teste de commit

  @CreateDateColumn({ type: 'timestamptz', name: 'data_vinculo' })
  dataVinculo: Date;

  @ManyToOne(() => CorridaEntity, (corrida) => corrida.motoristas)
  @JoinColumn({ name: 'id_corrida', referencedColumnName: 'idCorrida' })
  corrida?: CorridaEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_motorista', referencedColumnName: 'idUsuario' })
  motorista?: UsuarioEntity;
}
