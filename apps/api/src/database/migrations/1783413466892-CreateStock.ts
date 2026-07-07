import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStock1783413466892 implements MigrationInterface {
    name = 'CreateStock1783413466892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, "warehouseId" uuid NOT NULL, "quantity" integer NOT NULL, "lowStockThreshold" integer NOT NULL, CONSTRAINT "UQ_fbd5551c5ca0cd71ebf58619731" UNIQUE ("productId", "warehouseId"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_e855a71c31948188c2bf78824a5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_2cc5be32db1259f44995d0100aa" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_2cc5be32db1259f44995d0100aa"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_e855a71c31948188c2bf78824a5"`);
        await queryRunner.query(`DROP TABLE "stock"`);
    }

}
