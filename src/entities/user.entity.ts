import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({name: 'user'})
export class User {
  @PrimaryColumn({name: 'user_token_id'})
  userTokenId: string

  @Column({name: 'user_name'})
  userName: string

  @Column({name: 'user_description'})
  userDescription: string

  @Column({name: 'user_profile_pic'})
  userProfilePic: string
}
