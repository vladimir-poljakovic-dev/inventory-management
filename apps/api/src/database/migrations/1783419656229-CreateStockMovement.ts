import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStockMovement1783419656229 implements MigrationInterface {
    name = 'CreateStockMovement1783419656229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stock_movements_type_enum" AS ENUM('in', 'out', 'adjustment')`);
        await queryRunner.query(`CREATE TABLE "stock_movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stockId" uuid NOT NULL, "userId" uuid NOT NULL, "quantityDelta" integer NOT NULL, "reason" character varying NOT NULL, "type" "public"."stock_movements_type_enum" NOT NULL, CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_7d46969a34089aeea345f1f328f" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_4fc9f6fc2db22fc301f7c1c918b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_4fc9f6fc2db22fc301f7c1c918b"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_7d46969a34089aeea345f1f328f"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
        await queryRunner.query(`DROP TYPE "public"."stock_movements_type_enum"`);
    }

}
