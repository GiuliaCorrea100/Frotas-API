import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1746023658482 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE frota.usuario(
        id_usuario serial NOT NULL,
        id_pessoa_singu integer NOT NULL,
        permissao integer NOT NULL,
        CONSTRAINT fk_id_pessoa_singu FOREIGN KEY (id_pessoa_singu) REFERENCES frota.pessoa(id_pessoa),
        CONSTRAINT id_user_pk PRIMARY KEY (id_usuario)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE frota.usuario DROP CONSTRAINT IF EXISTS fk_id_pessoa_singu;',
    );

    await queryRunner.query(`DROP TABLE IF EXISTS frota.usuario`);
  }
}
