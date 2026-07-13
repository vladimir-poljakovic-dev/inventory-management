import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StockMovementType } from '@repo/types';
import { BaseEntity } from '../database/base.entity';
import { Stock } from '../stock/stock.entity';
import { User } from '../users/user.entity';

@Entity('stock\_movements')
export class StockMovement extends BaseEntity {
@ManyToOne( () => Stock, {eager:true})
@JoinColumn({ name: 'stockId' })
stock: Stock;

@Column()
stockId: string;

@ManyToOne(() => User)
@JoinColumn({ name: 'userId' })
user: User;

@Column()
userId: string;

@Column( {type: 'integer' })
quantityDelta: number;

@Column ({type: 'varchar'})
reason: string;

@Column({
    type: 'enum',
    enum: StockMovementType,
})
type: StockMovementType;
}