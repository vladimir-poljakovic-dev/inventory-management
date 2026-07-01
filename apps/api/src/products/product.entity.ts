import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { Category } from 'src/categories/category.entity';

@Entity ('products') 
export class Product extends BaseEntity {
    @Column()
    name: string;

    @Column({unique: true})
    sku: string;

    @Column({nullable: true})
    description: string;

    @Column({ type: 'decimal', precision: 10, scale:2})
    price: number;

    @ManyToOne(() => Category, {eager: true})
    @JoinColumn({name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;
}