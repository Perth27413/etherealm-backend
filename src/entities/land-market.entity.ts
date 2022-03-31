import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { MarketType } from "./market-type.entity";
import { Land } from "./land.entity";
import { User } from "./user.entity";

@Entity({name: "land_market"})
export class LandMarket {

    @PrimaryGeneratedColumn({name: 'land_market_id'})
    landMarketId: number

    @ManyToOne(() => Land, land => land.landTokenId)
    @JoinColumn({name: 'land_token_id'})
    landTokenId: Land

    @ManyToOne(() => User, user => user.userTokenId)
    @JoinColumn({name: 'owner_user_token_id'})
    ownerUserTokenId: User

    @ManyToOne(() => MarketType, marketType => marketType.marketTypeId)
    @JoinColumn({name: 'market_type'})
    marketType: MarketType

    @Column({name: 'price'})
    price: number

    @Column({name: 'period'})
    period: number

}