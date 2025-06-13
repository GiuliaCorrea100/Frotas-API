import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'carros' })
export class CarrosEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_carro' })
  idCarros?: number;

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
}
