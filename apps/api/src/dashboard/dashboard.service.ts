import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';
import type { DashboardData } from '@repo/types';


@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) {}

  async getDashboard(): Promise<DashboardData> {
    const [
      totalProducts,
      totalWarehouses,
      totalSuppliers,
      stockValueResult,
      lowStockItems,
      recentMovements,
    ] = await Promise.all([
      this.productRepository.count(),
      this.warehouseRepository.count(),
      this.supplierRepository.count(),
      this.stockRepository
        .createQueryBuilder('stock')
        .leftJoin('stock.product', 'product')
        .select('COALESCE(SUM(CAST(stock.quantity AS FLOAT) * CAST(product.price AS FLOAT)), 0)', 'total')
        .getRawOne<{ total: string }>(),
      this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.product', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('stock.warehouse', 'warehouse')
        .where('stock.lowStockThreshold > 0')
        .andWhere('stock.quantity < stock.lowStockThreshold')
        .orderBy(
          'CAST(stock.quantity AS FLOAT) / CAST(stock."lowStockThreshold" AS FLOAT)',
          'ASC',
        )
        .getMany(),
      this.stockMovementRepository
        .createQueryBuilder('movement')
        .leftJoinAndSelect('movement.stock', 'stock')
        .leftJoinAndSelect('stock.product', 'product')
        .leftJoin('movement.user', 'user')
        .addSelect(['user.id', 'user.email', 'user.role'])
        .orderBy('movement.createdAt', 'DESC')
        .take(10)
        .getMany(),
    ]);

    return {
      totalProducts,
      totalWarehouses,
      totalSuppliers,
      lowStockCount: lowStockItems.length,
      totalStockValue: parseFloat(stockValueResult?.total ?? '0'),
      recentMovements: recentMovements as any,
      lowStockItems: lowStockItems as any,
    } as DashboardData;
  }
}