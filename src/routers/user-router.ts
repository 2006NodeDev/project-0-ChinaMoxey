import express,{Request,Response,NextFunction} from 'express'
import {User} from '../models/User'
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { authenticationMiddleware } from '../middleware/authentication-middleware';
import { getAllUsers,getUserById,UserUpdate } from '../daos/user-daos';
import { authorizationMiddleware } from '../middleware/authorization-middleware';

export let userRouter = express.Router()

userRouter.use(authenticationMiddleware)

//get all users
userRouter.get('/', authorizationMiddleware(['finance-manager','Admin']), async(req:Request,res:Response,next:NextFunction)=>{
    try{
        let getUsers = await getAllUsers()
        res.json(getUsers)
    }catch(e){
        next(e)
    }
})
 
//update users
 userRouter.patch('/', authorizationMiddleware(['Admin']),async (req:Request, res:Response, next:NextFunction)=>{
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(!userId) { //update request must contain a userId
        res.status(400).send('Please enter a valid user Id')
    }
    else if(isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id must be a number')
    }
    else {
        let changeUser:User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        changeUser.username = username || undefined
        changeUser.password = password || undefined
        changeUser.firstName = firstName || undefined
        changeUser.lastName = lastName || undefined
        changeUser.email = email || undefined
        changeUser.role = role || undefined
        try {
            let result = await UserUpdate(changeUser)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}) 
//get user by Id
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
