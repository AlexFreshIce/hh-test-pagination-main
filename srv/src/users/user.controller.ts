import { UserService } from './users.service';
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    console.log(page, pageSize);
    if (page && pageSize) {
      this.logger.log(`Get page ${page} of users with page size ${pageSize}`);
      const { users, totalCount } = await this.userService.findPartialUsers(page, pageSize);
      return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount };
    } else {
      this.logger.log('Get all users');
      const users = await this.userService.findAll();
      return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount: 1 };
    }
  }
}
