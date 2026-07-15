import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CorridaEntity } from './corrida.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity({ name: 'ocorrencia' })
export class OcorrenciaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_ocorrencia' })
  idOcorrencia?: number;

  @Column({ type: 'varchar', name: 'descricao' })
  descricao: string;

  @Column({ type: 'int', name: 'id_corrida', nullable: false })
  idCorrida: number;

  // @Column({ type: 'timestamptz', name: 'data_registro' })
  // dataRegistro: Date;

  @Column({ type: 'timestamptz', name: 'data_ocorrencia' })
  dataOcorrencia: Date;

  @Column({ type: 'boolean', name: 'ativa' })
  ativa?: boolean;

  @Column({ type: 'int', name: 'id_motorista', nullable: true })
  idMotorista?: number;

  @ManyToOne(() => CorridaEntity, { nullable: false })
  @JoinColumn({ name: 'id_corrida', referencedColumnName: 'idCorrida' })
  corrida?: CorridaEntity;

  @ManyToOne(() => UsuarioEntity)
    @JoinColumn({ name: 'id_motorista', referencedColumnName: 'idUsuario' })
    motorista?: UsuarioEntity;


}
