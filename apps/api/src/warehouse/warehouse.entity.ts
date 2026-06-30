import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';

@Entity('warehouses')
export class Warehouse extends BaseEntity {
    @Column({unique: true})
    name: string;

    @Column()
    location: string;

    @Column({nullable: true})
    description: string;
}