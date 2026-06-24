import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@repo/types';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  role?: Role;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(data: CreateUserData): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
}
