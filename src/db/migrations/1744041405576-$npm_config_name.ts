import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744041405576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
          CREATE TABLE frota.corrida(
            id_corrida serial NOT NULL,
            data_inicio timestamptz NOT NULL,
            data_termino timestamptz NOT NULL,
            distancia_km varchar(256) NOT NULL,
            itinerario text NOT NULL,
            CONSTRAINT id_corrida_pk PRIMARY KEY (id_corrida)
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS frota.corrida`);
  }
}
