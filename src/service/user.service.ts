import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import DataNotFoundException from 'src/Exception/DataNotFoundException';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  public async createUserByTokenId(userTokenId: string): Promise<User> {
    try {
      const existsUser: User = await this.checkUserIsExists(userTokenId)
      if (existsUser) {
        return existsUser
      }
      let data: User = {
        userTokenId: userTokenId,
        userName: '',
        userDescription: '',
        userProfilePic: ''
      }
      let user: User = await this.userRepo.save(data)
      return user
    } catch (error) {
      console.error(error)
    }
  }

  public async updateUserProfileByTokenId(userRequest: User): Promise<User> {
    try {
      const existsUser: User = await this.checkUserIsExists(userRequest.userTokenId)
      if (JSON.stringify(existsUser) === JSON.stringify(userRequest)) {
        return existsUser
      }
      if (existsUser) {
        let user: User = await this.userRepo.save(userRequest)
        return user
      }
      throw new DataNotFoundException
    } catch (error) {
      console.error(error)
    }
  }

  public async findUserByTokenId(userTokenId: string): Promise<User> {
    let user: User = await this.userRepo.findOne(userTokenId.toLowerCase())
    if (!user) {
      throw new DataNotFoundException
    }
    return user
  }

  private async checkUserIsExists(userTokenId: string): Promise<User | null> {
    let user: User = await this.userRepo.findOne(userTokenId.toLowerCase())
    if (user) {
      return user
    }
    return null
  }

}
