import express, { Response, Request, NextFunction } from 'express'
import { userRouter} from './routers/user-router';
import { loggingMiddleware } from './middleware/logging-middleware';
import { reimbursementRouter } from './routers/reimbursement-router';
import {LoginError} from './errors/LoginError'
import { sessionMiddleware } from './middleware/session-middleware';
import { getUsernameAndPassword } from './daos/user-daos';
const app = express(); // calling express function



app.use(express.json())//middleware 

app.use(loggingMiddleware) //custom middleware for logging
app.use(sessionMiddleware)// custom middleware for session

app.use('/users',userRouter) //user router 
app.use('/reimbursements',reimbursementRouter) // reimbursement router

app.post('/login',async (req:Request,res:Response,next:NextFunction) =>{
    let username = req.body.username
    let password = req.body.password

        if(!username || !password){
            throw new LoginError()
        }else{
            try{
                let user = await getUsernameAndPassword(username, password)
                req.session.user = user
                res.json(user)
            }catch(e){
                next(e)
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




