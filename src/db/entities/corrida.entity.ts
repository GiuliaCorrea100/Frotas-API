import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { CarroEntity } from './carro.entity';
//import { OcorrenciasEntity } from './ocorrencias.entity';

@Entity({ name: 'corrida' })
export class CorridaEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_corrida' })
  idCorrida?: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_inicio' })
  dataInicio: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_termino' })
  dataTermino: Date;

  @Column({ type: 'varchar', name: 'distancia_km' })
  distanciaKm: string;

  @Column({ type: 'varchar', name: 'local_de_saida' })
  localDeSaida: string;

  @Column({ type: 'int', name: 'id_carro', nullable: false })
  idCarro: number;

  @Column({ type: 'int', name: 'id_motorista', nullable: false })
  idMotorista: number;

  @Column({ type: 'varchar', name: 'situacao', nullable: false })
  situacao: string;

  @Column({ type: 'boolean', name: 'chave_emprestada', nullable: false })
  chaveEmprestada: boolean;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'id_motorista', referencedColumnName: 'idUsuario' })
  motorista?: UsuarioEntity;

  @ManyToOne(() => CarroEntity)
  @JoinColumn({ name: 'id_carro', referencedColumnName: 'idCarro' })
  carro?: CarroEntity;

  @CreateDateColumn({ type: 'timestamptz', name: 'data_hora_liberacao_chave' })
  dataHoraLiberacaoChave: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'data_hora_recebimento_chave',
  })
  dataHoraRecebimentoChave: Date;
}
