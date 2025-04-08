import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744042181574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
          CREATE TABLE frota.multas(
            id_multa serial NOT NULL,
            num_auto_infracao integer NOT NULL, 
            cod_infracao varchar(256) NOT NULL,
            class_infracao varchar(10) NOT NULL,
            valor varchar(100) NOT NULL,
            placa varchar(100) NOT NULL,
            data_infracao DATE NOT NULL,
            CONSTRAINT id_multas_pk PRIMARY KEY (id_multa)
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS multas`);
  }
}
