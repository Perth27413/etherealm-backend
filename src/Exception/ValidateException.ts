import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidateException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}