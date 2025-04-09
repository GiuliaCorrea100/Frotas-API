import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1744041996857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
          CREATE TABLE frota.abastecimento(
            id_abastecimento serial NOT NULL,
            litros integer NOT NULL, 
            cod_pagamento varchar(100) NOT NULL,
            preco_final varchar(10) NOT NULL,
            tipo_combustivel varchar(100) NOT NULL,
            data_abastecimento timestamptz NOT NULL, 
            CONSTRAINT id_abastecimento_pk PRIMARY KEY (id_abastecimento)
          )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS frota.abastecimento`);
  }
}
