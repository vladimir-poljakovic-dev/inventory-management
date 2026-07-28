import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdjustStockDto, StockMovementType } from '@repo/types';
import { DataSource, Repository } from 'typeorm';
import { StockMovement } from '../stock-movements/stock-movement.entity';
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  findLowStock(): Promise<Stock[]> {
    return this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .where('stock.lowStockThreshold > 0')
      .andWhere('stock.quantity < stock.lowStockThreshold')
      .orderBy(
        'CAST(stock.quantity AS FLOAT) / CAST(stock."lowStockThreshold" AS FLOAT)',
        'ASC',
      )
      .getMany();
  }

  async adjust(dto: AdjustStockDto, userId: string): Promise<Stock> {
    return this.dataSource.transaction(async (em) => {
      const stock = await em
        .createQueryBuilder(Stock, 'stock')
        .where('stock.productId = :productId AND stock.warehouseId = :warehouseId', {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        })
        .setLock('pessimistic_write')
        .getOne();

      if (!stock) throw new NotFoundException('Stock record not found');

      stock.quantity += dto.quantityDelta;

      if (stock.quantity < 0) {
        throw new BadRequestException('Stock quantity cannot go below zero.');
      }

      await em.save(stock);

      const type =
        dto.quantityDelta > 0
          ? StockMovementType.IN
          : dto.quantityDelta < 0
            ? StockMovementType.OUT
            : StockMovementType.ADJUSTMENT;

      const movement = em.create(StockMovement, {
        stockId: stock.id,
        userId,
        quantityDelta: dto.quantityDelta,
        reason: dto.reason,
        type,
      });

      await em.save(movement);

      return this.stockRepository.findOne({
        where: { id: stock.id },
      }) as Promise<Stock>;
    });
  }
}