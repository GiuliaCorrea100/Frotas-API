import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_usuario' })
  idUsuario?: number;

  @Column({ type: 'int', name: 'id_pessoa_singu' })
  idPessoaSingu: number;

  @Column({ type: 'int', name: 'permissao' })
  permissao: number;
}
