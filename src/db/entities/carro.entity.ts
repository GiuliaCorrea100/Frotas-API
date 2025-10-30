import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoCombustivelEntity } from './tipoCombustivel.entity';

@Entity({ name: 'carro' })
export class CarroEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_carro' })
  idCarro?: number;

  @Column({ type: 'int', name: 'tombo' })
  tombo: number;

  @Column({ type: 'varchar', name: 'qr_code' })
  qrCode: string;

  @Column({ type: 'varchar', name: 'placa' })
  placa: string;

  @Column({ type: 'varchar', name: 'odometro' })
  odometro: string;

  @Column({ type: 'varchar', name: 'modelo' })
  modelo: string;

  @Column({ type: 'int', name: 'ano' })
  ano: number;

  @Column({ type: 'varchar', name: 'localidade_fisica' })
  localidadeFisica: string;

  @Column({ type: 'varchar', name: 'situacao' })
  situacao: string;

  @Column({ type: 'boolean', name: 'ativo' })
  ativo: boolean;

  @ManyToOne(() => TipoCombustivelEntity)
  @JoinColumn({ name: 'id_tipo_combustivel' })
  tipo_combustivel: TipoCombustivelEntity;
}
