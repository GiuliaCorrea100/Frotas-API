/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'pessoa', schema: 'comum' })
export class PessoaSigaaEntity {

    @PrimaryGeneratedColumn({ type: 'integer', name: 'id_pessoa' })
    idPessoa: number;

    @Column({ type: 'character varying', name: 'nome' })
    nome: string;
}
