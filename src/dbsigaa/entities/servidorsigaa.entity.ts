/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'servidor', schema: 'rh'})
export class ServidorSigaaEntity {

    @PrimaryGeneratedColumn({type: 'integer', name: 'id_servidor'})
    idServidor: number;

    @Column({type: 'integer', name: 'id_pessoa'})
    idPessoa: number;
}