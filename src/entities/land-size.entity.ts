import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'land_size'})
export class LandSize {
  @PrimaryGeneratedColumn({name: 'land_size_id'})
  landSizeId: number

  @Column({name: 'land_size'})
  landSize: number
}
