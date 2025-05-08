import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'pessoa' })
export class UserSinguEntity {
  @PrimaryColumn({ type: 'integer', name: 'id_pessoa' })
  idPessoa: number;

  @Column({ type: 'character varying', name: 'codigo_nacional' })
  login: string;

  @Column({ type: 'character varying', name: 'senha' })
  senha: string;

  @Column({ type: 'character varying', name: 'email' })
  email: string;

  @Column({ type: 'character varying', name: 'nome' })
  nome: string;

  /*@OneToOne(() => UserEntity)
  @JoinColumn({ name: 'id_pessoa_singu' })
  idPessoaSingu: number;*/
}
