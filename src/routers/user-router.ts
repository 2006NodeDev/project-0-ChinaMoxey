import express,{Request,Response,NextFunction} from 'express'
//import {InputError} from '../errors/InputError'
//import {User} from '../models/User'
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
//import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllUsers,getUserById } from '../daos/user-daos';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export let userRouter = express.Router()

userRouter.use(authenticationMiddleware)
//need to add user router code
userRouter.get('/', authorizationMiddleware(['finance-manager','Admin']), async(req:Request,res:Response,next:NextFunction)=>{
    //get all user data outside of scope
    try{
        let getUsers = await getAllUsers()
        res.json(getUsers)
    }catch(e){
        next(e)
    }
})
 
//  userRouter.patch('/', authorizationMiddleware(['Admin']),async (req:Request, res:Response, next:NextFunction)=>{
//     let  users: User = req.body
          
//     try{
//         if (isNaN(users.userId)){
//             throw new InputError()
//         } else if(!users){
//             throw new Error ('Unhandled Error')
//         }

//         let result = await UserUpdate(users)
//         res.json(result)

//     }catch (e){
//         next(e)

//     }
   
// }) 
 userRouter.get('/:id',authorizationMiddleware(['finance-manager']),async(req:Request,res:Response,next:NextFunction)=>{
    let {id} = req.params;
    if(isNaN(+id)){
        throw new UserNotFoundError()
    }else {
       try {
        let users = await getUserById(+id)
        res.json(users);
       } catch (e) {
           next(e);
       }
    }
 })
