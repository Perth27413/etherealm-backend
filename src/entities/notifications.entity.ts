import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { NotificationActivity } from "./notification-activity.entity";
import { Land } from "./land.entity";

@Entity({name: "notifications"})
export class Notifications {

    @PrimaryGeneratedColumn({name: 'notification_id'})
    notificationId: number

    @ManyToOne(() => User, user => user.userTokenId)
    @JoinColumn({name: 'owner_user_token_id'})
    ownerUserTokenId: User
    
    @ManyToOne(() => User, user => user.userTokenId)
    @JoinColumn({name: 'from_user_token_id'})
    fromUserTokenId: User

    @ManyToOne(() => NotificationActivity, activity => activity.activityId)
    @JoinColumn({name: 'activity_id'})
    activityId: NotificationActivity

    @Column({name: 'price'})
    price: number

    @ManyToOne(() => Land, land => land.landTokenId)
    @JoinColumn({name: 'land_token_id'})
    landTokenId: Land

    @Column({name: 'date_time'})
    dateTime: Date

}