import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CorridaEntity } from '../entities/corrida.entity'; 
import { CorridaVistoriaEntity } from './corridaVistoria.entity';

@Entity({ name: 'corrida_vistoria_foto' })
export class CorridaVistoriaFotoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida_vistoria_foto' })
  idCorridaVistoriaFoto?: number;

  @Column({ type: 'int', name: 'id_corrida_vistoria', nullable: false })
  idCorridaVistoria: number;

  @CreateDateColumn({ type: 'timestamp', name: 'data_upload' })
  dataUpload: Date;

  @ManyToOne(() => CorridaVistoriaEntity)
  @JoinColumn({ name: 'id_corrida', referencedColumnName: 'idCorridaVistoria' })
  corridaVistoria?: CorridaVistoriaEntity;


}