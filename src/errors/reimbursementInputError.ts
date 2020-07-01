import {HttpError} from './HttpError'

export class reimbursementInputError extends HttpError{
    constructor(){
        super(400,'The reimburseement Id must be a number');
        
    }
}