import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('tipo_combustivel')
export class TipoCombustivelEntity {
  @PrimaryGeneratedColumn()
  id_tipo_combustivel: number;

  @Column()
  nome: string;
}
