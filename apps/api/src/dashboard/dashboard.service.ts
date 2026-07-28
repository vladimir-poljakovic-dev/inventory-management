import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';

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

  async getDashboard() {
    const [
      totalProducts,
      totalWarehouses,
      totalSuppliers,
      lowStockCount,
      stockValues,
      recentMovements,
    ] = await Promise.all([
      this.productRepository.count(),
      this.warehouseRepository.count(),
      this.supplierRepository.count(),
      this.stockRepository
        .createQueryBuilder('stock')
        .where('stock.lowStockThreshold > 0')
        .andWhere('stock.quantity <= stock.lowStockThreshold')
        .getCount(),
      this.stockRepository
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.product', 'product')
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

    const totalStockValue = stockValues.reduce((sum, stock) => {
      return sum + stock.quantity * stock.product.price;
    }, 0);

    return {
      totalProducts,
      totalWarehouses,
      totalSuppliers,
      lowStockCount,
      totalStockValue: Math.round(totalStockValue * 100) / 100,
      recentMovements,
    };
  }
}