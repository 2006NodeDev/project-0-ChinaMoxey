import {Request, Response, NextFunction} from 'express'

    export function authorizationMiddleware(roles:string[]){
        return(req:Request,res:Response,next:NextFunction)=> {
            let allowed = false
                for(const role of roles){
                    if(req.session.user.role.role === role){
                        allowed = true
                        next()
                    }
                }
                if(!allowed){
                    res.status(403).send('You dont have permissions for this endpoint')
                }
        }
    }