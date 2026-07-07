import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../database/base.entity';

@Entity('warehouses')
export class Warehouse extends BaseEntity {
    @Column({unique: true})
    name: string;

    @Column()
    location: string;

    @Column({ type: 'varchar', nullable: true })
    description: string | null;
}