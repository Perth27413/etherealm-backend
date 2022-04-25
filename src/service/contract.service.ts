import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class ContractService {

  constructor() {}

  private provider = new ethers.providers.AlchemyProvider("rinkeby")

  public async getTransaction(tx: string): Promise<ethers.providers.TransactionReceipt> {
    await this.provider.getBlockNumber()
    const result = await this.provider.getTransaction(tx)
    const receipt: ethers.providers.TransactionReceipt = await result.wait()
    return receipt
  }
}
