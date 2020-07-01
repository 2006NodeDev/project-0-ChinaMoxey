import express, { Response } from 'express'
import { userRouter } from './routers/user-router';
import { loggingMiddleware } from './middleware/logging-middleware';
import { reimbursementRouter } from './routers/reimbursement-router';
const app = express(); // calling express function



app.use(express.json())//middleware 
app.use(loggingMiddleware) //custom middleware
app.use('/users',userRouter) //user router 
app.use('/reimbursements',reimbursementRouter) // reimbursement router


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




