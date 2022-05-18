import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { LandSize } from "./land-size.entity";
import { LandStatus } from "./land-status.entity";

@Entity({name: "land"})
export class Land {

    @PrimaryColumn({name: 'land_token_id'})
    landTokenId: string

    @Column({name: 'land_name'})
    landName: string

    @Column({name: 'land_description'})
    landDescription: string

    @Column({name: 'land_owner_token_id'})
    landOwnerTokenId: string

    @Column({name: 'land_location'})
    landLocation: string

    @Column({name: 'land_position'})
    landPosition: string

    @ManyToOne(() => LandStatus, landStatus => landStatus.landStatusId)
    @JoinColumn({name: 'land_status'})
    landStatus: LandStatus

    @Column({name: 'land_assets'})
    landAssets: string

    @ManyToOne(() => LandSize, landSize => landSize.landSizeId)
    @JoinColumn({name: 'land_size'})
    landSize: LandSize

    @Column({name: 'on_recommend'})
    onRecommend: boolean

    @Column({name: 'minimum_offer_price'})
    minimumOfferPrice: number

    @Column({name: 'created_at'})
    createdAt: Date

    @Column({name: 'updated_at'})
    updatedAt: Date

    @Column({name: 'price'})
    price: number
}