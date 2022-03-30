import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'notification_activity'})
export class NotificationActivity {
  @PrimaryGeneratedColumn({name: 'activity_id'})
  activityId: number

  @Column({name: 'activity_name'})
  activityName: string
}