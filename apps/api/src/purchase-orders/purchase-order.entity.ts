import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PurchaseOrderStatus } from '@repo/types';
import { BaseEntity } from '../database/base.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder extends BaseEntity {
  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  supplierId: string;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.PENDING,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { eager: true, cascade: true })
  items: PurchaseOrderItem[];
}