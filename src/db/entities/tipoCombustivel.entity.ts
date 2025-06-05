import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('tipo_combustivel')
export class TipoCombustivelEntity {
  
  @PrimaryGeneratedColumn({type: 'int', name: 'id_tipo_combustivel'})
  id_tipo_combustivel?: number;

  @Column()
  nome: string;
}
