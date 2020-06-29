import{HttpError} from "./HttpError"

export class UnauthorizedUser extends HttpError{
    constructor(){
        super(401,'The incoming token has expired')
    }
}