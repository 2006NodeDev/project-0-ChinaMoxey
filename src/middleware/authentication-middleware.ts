import{Response, NextFunction} from 'express'

//makes sure that the user is logged, if not tells them login
export function authenticationMiddleware(req:any, res:Response, next:NextFunction){
    if(!req.session.user){
        res.status(401).send('User needs to login in')
    }else{
        console.log(`user ${req.session.user.username} has a role of ${req.session.user.role.role}`);
        next()
    }
}