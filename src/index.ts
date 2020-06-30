import express, {Request, Response,NextFunction } from 'express'
import {User} from './models/User'
//import {HttpError} from './errors/HttpError'
import { InputError } from './errors/InputError';
import { LoginError } from './errors/LoginError';
const app = express(); // calling express function

app.get('/users',(req:Request,res:Response)=>{
    res.json(users);
})
app.post('/login',(req:Request,res:Response)=>{
    console.log(req.body)
    let{
        userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role} = req.body

        if(username && password){
            users.push({userId,username,password,firstName,lastName,email,role})
            res.sendStatus(201);
        }else{
            throw new LoginError();
        }
})
app.use(express.json())//middleware 

 app.post('/users',(req:Request,res:Response)=>{
     console.log(req.body);
     let {userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role}=req.body

        if(userId && username && password && firstName && lastName && email && role){
            users.push({userId,username,password,firstName,lastName,email,role})
            res.sendStatus(201);
        }else{
            throw new InputError();
        }
     res.sendStatus(501);
 })

 app.use((err,req,res,next:NextFunction)=>{
    if(err.statusCode){
        res.status(err.statusCode).send(err.message)
    }else{
        console.log(err);
        res.status(500).send('Oops something went wrong!')
    }
 })
//listening at port 2006
app.listen(2006, () =>{
    console.log('Started Server');
});




//fake user data 
let users:User[] = [{
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