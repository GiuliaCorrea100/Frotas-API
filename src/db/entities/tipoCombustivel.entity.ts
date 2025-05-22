import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('tipo_combustivel')
export class TipoCombustivelEntity {
  @PrimaryGeneratedColumn()
  tipo_combustivel_id: number;

  @Column()
  nome: string;
}
