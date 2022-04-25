import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class ContractService {

  constructor() {}

  private provider = new ethers.providers.AlchemyProvider("rinkeby")

  public async getTransaction(tx: string): Promise<ethers.providers.TransactionReceipt> {
    await this.provider.getBlockNumber()
    let receipt = null
    while (true) {
      const result = await this.provider.getTransaction(tx)
      if (result) {
        receipt = await result.wait()
        break
      }
    }
    return receipt
  }
}
