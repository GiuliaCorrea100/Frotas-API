import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
