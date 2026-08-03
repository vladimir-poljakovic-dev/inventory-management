import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Warehouse, Supplier, Stock, StockMovement])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}