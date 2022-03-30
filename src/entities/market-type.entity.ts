import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'market_type'})
export class MarketType {
  @PrimaryGeneratedColumn({name: 'market_type_id'})
  marketTypeId: number

  @Column({name: 'market_type_name'})
  marketTypeName: string
}