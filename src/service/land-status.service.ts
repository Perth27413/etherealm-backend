import { Injectable } from '@nestjs/common';

@Injectable()
export class LandStatusService {

  findAll() {
    return `This action returns all landStatus`;
  }

}
