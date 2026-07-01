import {Column, Entity} from 'typeorm';
import { BaseEntity } from '../database/base.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
    @Column()
    name: string;

    @Column({unique:true})
    contactEmail: string;

    @Column({nullable:true})
    phone: string;

    @Column({nullable:true})
    address: string;
}
