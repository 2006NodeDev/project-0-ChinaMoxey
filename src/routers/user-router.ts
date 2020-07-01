import express,{Request,Response} from 'express'
import {InputError} from '../errors/InputError'
import {User} from '../models/User'
import { UserNotFoundError } from '../errors/UserNotFoundError';
export let userRouter = express.Router()

//need to add user router code
userRouter.get('/',(req:Request,res:Response)=>{
    res.json(users);
})
 userRouter.post('/',(req:Request,res:Response)=>{
     console.log(req.body);
     let {userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role}=req.body
     let found = false
        if(userId && username && password && firstName && lastName && email && role){
            users.push({userId,username,password,firstName,lastName,email,role})
            res.sendStatus(201);
        }else{
        if(!found){
            throw new InputError();
        }
        }
     res.sendStatus(501);
 })

 userRouter.get('/:id',(req:Request,res:Response)=>{
 let {id} = req.params //destructring
    if(isNaN(+id)){
        throw new InputError()
    }else{
        let found = false
        for(const user of users){
            if(user.userId === +id){
                res.json(user)
                found = true
            }
        }
        if(!found){
        throw new UserNotFoundError()
    }
    }
 })
 export let users:User[] = [{
    userId: 1,
    username: "monsterkiller123",
    password: "password",
    firstName: "Jane",
    lastName: "Doe",
    email:"JaneDoe@mail.com",
    role: [{
        roleID: 123124,
        role: "User"
    }]

},
{
    userId: 2,
    username: "philtocrazy",
    password: "password1",
    firstName: "Phil",
    lastName: "Grover",
    email:"PhillyG@mail.com",
    role: [{
        roleID: 13453,
        role: "User"
    }]  
},
{
    userId: 3,
    username: "foodwiz",
    password: "password2",
    firstName: "John",
    lastName: "Doe",
    email:"JohnDoe@mail.com",
    role: [{
        roleID: 13443,
        role: "User"
    }]    
}

]