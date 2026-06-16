import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CorridaVistoriaEntity } from './corridaVistoria.entity';

@Entity({ name: 'corrida_vistoria_foto' })
export class CorridaVistoriaFotoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida_vistoria_foto' })
  idCorridaVistoriaFoto?: number;

  @Column({ type: 'int', name: 'id_corrida_vistoria', nullable: false })
  idCorridaVistoria: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_upload' })
  dataUpload: Date;

  @CreateDateColumn({ type: 'varchar', name: 'url_arquivo' })
  urlArquivo: string;

  @ManyToOne(() => CorridaVistoriaEntity)
  @JoinColumn({ 
    name: 'id_corrida_vistoria',  
    referencedColumnName: 'idCorridaVistoria'
  })
  corridaVistoria?: CorridaVistoriaEntity;
}