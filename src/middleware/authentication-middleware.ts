import{Response, NextFunction} from 'express'

export function authenticationMiddleware(req:any, res:Response, next:NextFunction){
    if(!req.session.user){
        res.status(401).send('User needs to login it')
    }else{
        console.log(`user ${req.session.user.username} has a role of ${req.session.user.role}`);
        next()
    }
}