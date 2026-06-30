import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSupplier1782750933911 implements MigrationInterface {
    name = 'CreateSupplier1782750933911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suppliers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "contactEmail" character varying NOT NULL, "phone" character varying, "address" character varying, CONSTRAINT "UQ_73b931b7234efb45f68da516bc7" UNIQUE ("contactEmail"), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "suppliers"`);
    }

}
