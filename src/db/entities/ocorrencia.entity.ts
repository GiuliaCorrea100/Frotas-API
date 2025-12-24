import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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


  @Column({ type: 'boolean', name: 'ativa'})
  ativa?: boolean;
}
