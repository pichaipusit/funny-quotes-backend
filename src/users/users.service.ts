import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByUsername(username: string) {
    return await this.repo.findOne({ where: { username } });
  }

  async create(username: string, password: string) {
    const user = this.repo.create({ username, password });
    return await this.repo.save(user);
  }
}
