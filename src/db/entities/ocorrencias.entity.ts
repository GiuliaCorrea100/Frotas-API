import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
//import { CorridasEntity } from './corrida.entity';

@Entity({ name: 'ocorrencias' })
export class OcorrenciasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_ocorrencia' })
  idOcorrencias?: number;

  @Column({ type: 'varchar', name: 'descricao' })
  descricao: string;

  @Column({ type: 'int', name: 'id_corrida', nullable: false })
  idCorrida: number;

  @Column({ type: 'date', name: 'data_registro' })
  dataRegistro: Date;
}
