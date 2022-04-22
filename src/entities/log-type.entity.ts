import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'log_type'})
export class LogType {
  @PrimaryGeneratedColumn({name: 'log_type_id'})
  logTypeId: number

  @Column({name: 'log_type_name'})
  logTypeName: string
}