import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/service/user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  public async createUserFromTokenId(@Query("userTokenId") userTokenId: string): Promise<User> {
    let user: User = await this.userService.createUserByTokenId(userTokenId)
    return user
  }

}
