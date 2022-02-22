import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
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

    @ManyToOne(() => LandStatus, landStatus => landStatus.landStatusId)
    @JoinColumn({name: 'land_status'})
    landStatus: LandStatus

    @Column({name: 'land_assets'})
    landAssets: string

    @Column({name: 'on_recommend'})
    onRecommend: boolean
}