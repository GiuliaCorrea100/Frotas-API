import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744041405576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
          CREATE TABLE frota.corridas(
            id serial NOT NULL,
            data_inicio timestamptz NOT NULL,
            data_termino timestamptz NOT NULL,
            distancia_km varchar(256) NOT NULL,
            itinerario text NOT NULL,
            CONSTRAINT id_corridas_pk PRIMARY KEY (id)
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS corridas`);
  }
}
