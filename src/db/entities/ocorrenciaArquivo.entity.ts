import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OcorrenciaEntity } from './ocorrencia.entity';

@Entity({ name: 'ocorrencia_arquivo' })
export class OcorrenciaArquivoEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_ocorrencia_arquivo' })
  idOcorrenciaArquivo?: number;

  @Column({ type: 'int', name: 'id_ocorrencia', nullable: false })
  idOcorrencia: number;

  @Column({ type: 'timestamptz', name: 'data_upload' })
  dataUpload: Date;

  @Column({ type: 'varchar', length: 100, name: 'url_arquivo', nullable: true })
  urlArquivo?: string;

  @ManyToOne(() => OcorrenciaEntity, { nullable: false })
  @JoinColumn({ name: 'id_ocorrencia', referencedColumnName: 'idOcorrencia' })
  ocorrencia?: OcorrenciaEntity;
}
