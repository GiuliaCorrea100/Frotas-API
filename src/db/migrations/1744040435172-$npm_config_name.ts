import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744040435172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE frota.cnh(
        id_cnh serial NOT NULL, 
        nome varchar(100) NOT NULL,
        classificacao varchar(10) NOT NULL,
        data_emissao DATE NOT NULL,
        data_validade DATE NOT NULL,
        CONSTRAINT id_cnh_pk PRIMARY KEY (id)
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS cnh`);
  }
}
