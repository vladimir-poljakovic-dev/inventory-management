import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../database/base.entity';
import { Category } from '../categories/category.entity';

@Entity ('products') 
export class Product extends BaseEntity {
    @Column()
    name: string;

    @Column({unique: true})
    sku: string;

    @Column({type: 'varchar', nullable: true})
    description: string | null;

    @Column({ type: 'decimal', precision: 10, scale:2, transformer: {
        to: (v: number) => v,
        from: (v: string )=> parseFloat(v),
    }})
    price: number;

    @ManyToOne(() => Category, {eager: true})
    @JoinColumn({name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;
}