import { Role } from '@repo/types';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Viewer })
  role: Role;
}
