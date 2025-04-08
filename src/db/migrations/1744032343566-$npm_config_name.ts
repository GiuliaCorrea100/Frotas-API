import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744032343566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE frota.carros(
        id serial NOT NULL,
        tombo integer NOT NULL, 
        qrCode varchar(256) NOT NULL,
        placa varchar(10) NOT NULL,
        odometro varchar(100) NOT NULL,
        modelo varchar(100) NOT NULL,
        ano integer NOT NULL,
        CONSTRAINT id_pk PRIMARY KEY (id)
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS carros`);
  }
}
