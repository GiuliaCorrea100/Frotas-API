import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CorridaEntity } from '../entities/corrida.entity'; 
import { UsuarioEntity } from '../entities/usuario.entity';

@Entity({ name: 'corrida_vistoria' })
export class CorridaVistoriaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida_vistoria' })
  idCorridaVistoria?: number;

  @Column({ type: 'int', name: 'id_corrida', nullable: false })
  idCorrida: number;

  @Column({ type: 'varchar', length: 20, name: 'tipo', nullable: false })
  tipo: string;

  @Column({ type: 'bool', name: 'veiculo_recebido_sem_avarias', default: true })
  veiculoRecebidoSemAvarias: boolean;

  @Column({ type: 'text', name: 'observacoes', nullable: true })
  observacoes: string;

  @CreateDateColumn({ type: 'timestamp', name: 'data_registro' })
  dataRegistro: Date;

  @Column({ type: 'int', name: 'registrado_por', nullable: false })
  registradoPor: number;

  @ManyToOne(() => CorridaEntity)
  @JoinColumn({ name: 'id_corrida', referencedColumnName: 'idCorrida' })
  corrida?: CorridaEntity;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'registrado_por', referencedColumnName: 'idUsuario' })
  usuarioRegistrou?: UsuarioEntity;
}