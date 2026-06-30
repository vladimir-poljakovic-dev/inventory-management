import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWarehouse1782815782755 implements MigrationInterface {
    name = 'CreateWarehouse1782815782755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "location" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_be9dd3cc2931f11f7440f2eeb19" UNIQUE ("name"), CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "warehouses"`);
    }

}
