import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/db/entities/users.entity';

@Entity({ name: 'pessoa' })
export class UserSinguEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_usuario' })
  idUsuarioSingu: number;

  @Column({ type: 'character varying', name: 'codigo_nacional' })
  login: string;

  @Column({ type: 'character varying', name: 'senha' })
  senha: string;

  @Column({ type: 'character varying', name: 'email' })
  email: string;

  @Column({ type: 'character varying', name: 'nome' })
  nome: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id_pessoa_singu' })
  idPessoaSingu: number;
}
