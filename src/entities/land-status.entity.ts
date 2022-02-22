import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'land_status'})
export class LandStatus {
  @PrimaryGeneratedColumn({name: 'land_status_id'})
  landStatusId: number

  @Column({name: 'land_status_name'})
  landStatusName: string
}
