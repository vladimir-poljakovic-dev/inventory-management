import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehousesController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
import { Warehouse } from "./warehouse.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    controllers: [WarehousesController],
    providers: [WarehouseService],
    exports: [WarehouseService],
})
export class WarehousesModule {}