import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'log_description'})
export class LogDescription {
  @PrimaryGeneratedColumn({name: 'log_description_id'})
  logDescriptionId: number

  @Column({name: 'log_description_name'})
  logDescriptionName: string
}