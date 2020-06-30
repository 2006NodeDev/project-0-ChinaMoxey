import {HttpError} from './HttpError'

export class LoginError extends HttpError{
    constructor(){
        super(400,'Invalid Credentials')
    }
}