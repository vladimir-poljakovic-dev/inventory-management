import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePurchaseOrderDto, PurchaseOrderStatus, ReceivePurchaseOrderDto, StockMovementType } from '@repo/types';
import { Repository, DataSource } from 'typeorm';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Purchase order #${id} not found`);
    return order;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = this.purchaseOrderRepository.create({
      supplierId: dto.supplierId,
      notes: dto.notes,
      items: dto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
    const saved = await this.purchaseOrderRepository.save(order);
    return this.purchaseOrderRepository.findOne({ where: { id: saved.id} }) as Promise<PurchaseOrder>;
  }

  async receive(id: string, dto: ReceivePurchaseOrderDto, userId: string): Promise<PurchaseOrder> {
    return this.dataSource.transaction(async (em) => {
      // Lock only the PO row itself, no joins
      const order = await em
        .createQueryBuilder(PurchaseOrder, 'order')
        .where('order.id = :id', { id })
        .setLock('pessimistic_write')
        .getOne();
  
      if (!order) throw new NotFoundException(`Purchase order #${id} not found`);
      if (order.status === PurchaseOrderStatus.RECEIVED) {
        throw new BadRequestException('Purchase order has already been received.');
      }
  
      // Load items separately since we can't join with lock
      const items = await em.find(PurchaseOrderItem, {
        where: { purchaseOrderId: id },
      });
  
      for (const item of items) {
        let stock = await em.findOne(Stock, {
          where: { productId: item.productId, warehouseId: dto.warehouseId },
        });
  
        if (!stock) {
          stock = em.create(Stock, {
            productId: item.productId,
            warehouseId: dto.warehouseId,
            quantity: 0,
            lowStockThreshold: 0,
          });
          await em.save(stock);
        }
  
        stock.quantity += item.quantity;
        await em.save(stock);
  
        const movement = em.create(StockMovement, {
          stockId: stock.id,
          userId,
          quantityDelta: item.quantity,
          reason: `Purchase order #${id} received`,
          type: StockMovementType.IN,
        });
        await em.save(movement);
      }
  
      order.status = PurchaseOrderStatus.RECEIVED;
      await em.save(order);
  
      return em.findOne(PurchaseOrder, { where: { id } }) as Promise<PurchaseOrder>;
    });
  }
}