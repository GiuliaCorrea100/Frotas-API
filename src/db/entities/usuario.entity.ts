import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_usuario' })
  idUsuario?: number;

  @Column({ type: 'int', name: 'id_pessoa_sigaa' })
  idPessoaSigaa: number;

  @Column({ type: 'boolean', name: 'administrador' })
  administrador: boolean;

  @Column({ type: 'varchar', name: 'nome' })
  nome: string;
}
