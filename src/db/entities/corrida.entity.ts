import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { CarrosEntity } from './carros.entity';
//import { OcorrenciasEntity } from './ocorrencias.entity';

@Entity({ name: 'corridas' })
export class CorridasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida' })
  idCorrida?: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_inicio' })
  dataInicio: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_termino' })
  dataTermino: Date;

  @Column({ type: 'varchar', name: 'distancia_km' })
  distanciaKm: string;

  @Column({ type: 'varchar', name: 'local_de_saida' })
  local_de_saida: string;

  @Column({ type: 'int', name: 'id_carros', nullable: false })
  idCarros: number;

  @Column({ type: 'int', name: 'id_motorista', nullable: false })
  idMotorista: number;

  @Column({ type: 'varchar', name: 'situacao', nullable: false })
  situacao: string;

  @Column({ type: 'boolean', name: 'chave_emprestada', nullable: false })
  chaveEmprestada: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'id_motorista', referencedColumnName: 'idUsuario' })
  motorista?: UserEntity;

  @ManyToOne(() => CarrosEntity)
  @JoinColumn({ name: 'id_carros', referencedColumnName: 'idCarros' }) 
  carro?: CarrosEntity;

  // @OneToMany(() => OcorrenciasEntity, (ocorrencia) => ocorrencia.corrida)
  // ocorrencias?: OcorrenciasEntity[];
}
