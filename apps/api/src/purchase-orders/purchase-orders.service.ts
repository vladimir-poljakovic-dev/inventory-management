import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePurchaseOrderDto } from '@repo/types';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Injectable()
export class PurchaseOrderSErvice {
    constructor(
        @InjectRepository(PurchaseOrder)
        private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    ){}

    findAll(): Promise<PurchaseOrder[]> {
        return this,this.purchaseOrderRepository.find();
    }

    async findOne(id: string): Promise<PurchaseOrder> {
        const order = await this.purchaseOrderRepository.findOne({ where: { id } });
        if (!order) throw new NotFoundException(`Purchase order #${id} not found`);
        return order;
    }

    create (dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
        const order = this.purchaseOrderRepository.create({
            supplierId: dto.supplierId,
            notes: dto.notes,
            items: dto.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        });
        return this.purchaseOrderRepository.save(order);
    }
}