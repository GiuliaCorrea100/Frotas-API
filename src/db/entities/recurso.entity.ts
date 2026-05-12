import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MultaEntity } from "./multa.entity";

@Entity({name: 'recurso' })
export class RecursoEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_recurso'})
    idRecurso?: number;

    @Column({ type: 'varchar', name: 'url_arquivo'})
    urlArquivo: string;

    @Column({ type: 'varchar', name: 'justificativa'})
    justificativa: string;

    @Column({ type: 'int', name: 'id_multa', nullable: true })
    idMulta?: number;

    @Column({ type: 'varchar', name: 'justificativa_rejeicao'})
    justificativaRejeicao?: string;
    
    @OneToOne(() => MultaEntity, (multa) => multa.recurso)
    @JoinColumn({ name: 'id_multa' })
    multa?: MultaEntity;
}
