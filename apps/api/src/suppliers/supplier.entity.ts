import {Column, Entity} from 'typeorm';
import { BaseEntity } from '../database/base.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
    @Column()
    name: string;

    @Column({unique:true})
    contactEmail: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string | null;

    @Column({ type: 'varchar', nullable: true })
    address: string | null;
}
