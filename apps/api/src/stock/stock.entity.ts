import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "../database/base.entity";
import { Product } from "../products/product.entity";
import { Warehouse } from "../warehouses/warehouse.entity";

@Entity('stock')
@Unique(['productId', 'warehouseId'])
export class Stock extends BaseEntity {
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId'})
    product: Product;

    @Column()
    productId:string;

    @ManyToOne(() => Warehouse, { eager: true })
    @JoinColumn({ name: 'warehouseId'})
    warehouse: Warehouse;

    @Column()
    warehouseId: string;

    @Column({ type: 'integer'})
    quantity: number;

    @Column({ type: 'integer'})
    lowStockThreshold: number;
}