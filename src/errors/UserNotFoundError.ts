import {HttpError} from './HttpError'

export class UserNotFoundError extends HttpError{
    constructor(){
        super(400,'All feilds need to be filled out');
        
    }
}