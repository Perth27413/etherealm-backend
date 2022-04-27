import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";
import { LogType } from "./log-type.entity";

@Entity({name: "log_transactions"})
export class LogTransactions {

    @PrimaryGeneratedColumn({name: 'log_transactions_id'})
    logTransactionsId: number

    @ManyToOne(() => User, user => user.userTokenId)
    @JoinColumn({name: 'from_user_token_id'})
    fromUserTokenId: User
    
    @ManyToOne(() => User, user => user.userTokenId)
    @JoinColumn({name: 'to_user_token_id'})
    toUserTokenId: User

    @Column({name: 'transaction_block'})
    transactionBlock: string

    @Column({name: 'gas_price'})
    gasPrice: number

    @ManyToOne(() => LogType, logType => logType.logTypeId)
    @JoinColumn({name: 'log_type'})
    logType: LogType

    @Column({name: 'created_at'})
    createdAt: Date

}