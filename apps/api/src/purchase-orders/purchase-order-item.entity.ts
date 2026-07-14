import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../database/base.entity';
import { Product } from '../products/product.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem extends BaseEntity {
  @ManyToOne(() => PurchaseOrder, (order) => order.items)
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: string;

  @ManyToOne(() => Product, {eager: true})
  @JoinColumn({ name: 'productId'})
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'integer'})
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
    to: (v: number) => v,
    from: (v: string) => parseFloat(v),
  }})
  unitPrice: number;
}