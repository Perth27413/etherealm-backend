import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { Land } from "./land.entity";

@Entity({name: "offer_land"})
export class OfferLand {

  @PrimaryGeneratedColumn({name: 'offer_id'})
  offerId: number

  @ManyToOne(() => User, user => user.userTokenId)
  @JoinColumn({name: 'from_user_token_id'})
  fromUserTokenId: User

  @ManyToOne(() => Land, land => land.landTokenId)
  @JoinColumn({name: 'land_token_id'})
  landTokenId: Land

  @Column({name: 'offer_price'})
  offerPrice: number

  @Column({name: 'is_enough_point'})
  isEnoughPoint: boolean

  @Column({name: 'created_at'})
  createAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date

  @Column({name: 'is_delete'})
  isDelete: boolean

  @Column({name: 'fees'})
  fees: number
}