import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }
  // get partially list of all users
  async findPartialUsers(pageNumber: number, pageSize: number): Promise<{ users: UsersEntity[]; totalCount: number }> {
    const skip = (pageNumber - 1) * pageSize;
    const [users, totalCount] = await Promise.all([
      this.usersRepo.find({ skip, take: pageSize }),
      this.usersRepo.count(),
    ]);
    return { users, totalCount };
  }
}
