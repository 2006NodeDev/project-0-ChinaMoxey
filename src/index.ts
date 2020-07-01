import express, { Response, Request } from 'express'
import { userRouter,users } from './routers/user-router';
import { loggingMiddleware } from './middleware/logging-middleware';
import { reimbursementRouter } from './routers/reimbursement-router';
import {LoginError} from './errors/LoginError'
import { sessionMiddleware } from './middleware/session-middleware';
import { AuthenticationFailure } from './errors/AuthenticationFailure';
const app = express(); // calling express function



app.use(express.json())//middleware 

app.use(loggingMiddleware) //custom middleware for logging
app.use(sessionMiddleware)// custom middleware for session

app.use('/users',userRouter) //user router 
app.use('/reimbursements',reimbursementRouter) // reimbursement router

app.post('/login',(req:Request,res:Response) =>{
    let username = req.body.username
    let password = req.body.password
    
        if(!username || !password){
            throw new LoginError()
        }else{
            let found = false
            for(const user of users){
                if(user.username === username && user.password === password){

                    req.session.user = user
                    res.json(user)
                    found = true

                }

            }
            if(!found){
                throw new AuthenticationFailure()
            }
        }
})


 app.use((err,req,res:Response,next)=>{
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




