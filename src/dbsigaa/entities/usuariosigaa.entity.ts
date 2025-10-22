/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PessoaSigaaEntity } from "./pessoasigaa.entity"
import { ServidorSigaaEntity } from "./servidorsigaa.entity"

@Entity({name: 'usuario', schema: 'comum'})
export class UsuarioSigaaEntity {

    @PrimaryGeneratedColumn({ type: 'integer', name: 'id_usuario' })
    idUsuarioSigaa: number;

    @Column({type: 'integer', name: 'id_pessoa'})
    idPessoaSigaa: number;
    
    @Column({type: 'character varying', name: 'login'})
    login: string;
  
    @Column({type: 'character varying', name: 'senha'})
    senha: string;

    @Column({type: 'integer', name: 'id_servidor'})
    idServidor: number;

    @Column({type: 'character varying', name: 'email'})
    email: string;

    @ManyToOne(() => PessoaSigaaEntity)  // Relacionamento ManyToOne
    @JoinColumn({ name: 'id_pessoa' })  // Especifica a coluna de junção
    pessoa: PessoaSigaaEntity;

    @OneToOne(() => ServidorSigaaEntity)
    @JoinColumn({name: 'id_servidor'})
    servidor: ServidorSigaaEntity

}