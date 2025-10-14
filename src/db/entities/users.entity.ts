import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_usuario' })
  idUsuario?: number;

  @Column({ type: 'int', name: 'id_pessoa_sigaa' })
  idPessoaSigaa: number;

  @Column({ type: 'int', name: 'permissao' })
  permissao: number;

  @Column({ type: 'varchar', name: 'nome' })
  nome: string;
}
