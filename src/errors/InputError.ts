import {HttpError} from './HttpError'

export class InputError extends HttpError{
    constructor(){
        super(400,'All feilds need to be filled out');
    }
}