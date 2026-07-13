import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdjustStockDto, StockMovementType } from '@repo/types';
import { Repository } from 'typeorm';
import { StockMovement } from "../stock-movements/stock-movement.entity";
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private readonly stockRepository: Repository<Stock>,
        @InjectRepository(StockMovement)
        private readonly stockMovementRepository: Repository<StockMovement>,
    ) {}

    findAll(): Promise<Stock[]> {
        return this.stockRepository.find();
    }

    async adjust(dto: AdjustStockDto, userId: string): Promise<Stock> {
        const stock = await this.stockRepository.findOne({
            where: { productId: dto.productId, warehouseId: dto.warehouseId },
        });
    
    if (!stock) throw new NotFoundException('Stock record not found');

    stock.quantity += dto.quantityDelta;
    if (stock.quantity < 0) {
      throw new BadRequestException('Stock quantity cannot go below zero.');
    }
    await this.stockRepository.save(stock);

    const type =
      dto.quantityDelta > 0
        ? StockMovementType.IN
        : dto.quantityDelta < 0
          ? StockMovementType.OUT
          : StockMovementType.ADJUSTMENT;

    const movement = this.stockMovementRepository.create({
      stockId: stock.id,
      userId,
      quantityDelta: dto.quantityDelta,
      reason: dto.reason,
      type,
    });
    await this.stockMovementRepository.save(movement);

    return stock;
    }
}