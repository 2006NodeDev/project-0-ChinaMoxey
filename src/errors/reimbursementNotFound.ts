import {HttpError} from './HttpError'

export class reimbursementNotFound extends HttpError{
    constructor(){
        super(400,'Reimbursement not found.');
        
    }
}