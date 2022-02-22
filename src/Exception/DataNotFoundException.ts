import {HttpException, HttpStatus} from "@nestjs/common";

export default class DataNotFoundException extends HttpException{
    constructor() {
        super("Data not found!", HttpStatus.NOT_FOUND)
    }
}