import { HttpError } from "./HttpError";


export class AuthenticationFailure extends HttpError{
    constructor(){
        super(401,'Username or Password is Incorrect')
    }
}