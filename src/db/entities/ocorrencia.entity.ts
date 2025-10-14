import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ocorrencias' })
export class OcorrenciaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_ocorrencia' })
  idOcorrencia?: number;

  @Column({ type: 'varchar', name: 'descricao' })
  descricao: string;

  @Column({ type: 'int', name: 'id_corrida', nullable: false })
  idCorrida: number;

  @Column({ type: 'date', name: 'data_registro' })
  dataRegistro: Date;
}
