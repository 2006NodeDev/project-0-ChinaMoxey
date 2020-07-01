import express, {Response,Request} from 'express'
import { Reimbursement } from '../models/Reimbursement';
import { reimbursementInputError } from '../errors/reimbursementInputError';
import { reimbursementUserInputError } from '../errors/reimbursementUserInputError';
import { reimbursementNotFound } from '../errors/reimbursementNotFound';

export let reimbursementRouter = express.Router();

reimbursementRouter.get('/',(req:Request,res:Response)=>{
    res.json(reimbursements)
})

reimbursementRouter.post('/',(req:Request,res:Response) =>{
    console.log(req.body)
    let {reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type} = req.body
    let found = false
    if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type){
        reimbursements.push({reimbursementId,author,amount,dateSubmitted,dateResolved,description,resolver,status,type})
        res.sendStatus(201)
    }else{
        if(!found){
            throw new reimbursementInputError()
        }
    }
    res.sendStatus(501);
})

reimbursementRouter.get('/author/userId/:userId',(req:Request,res:Response)=> {
    let {id} = req.params
    if(isNaN(+id)){
        throw new reimbursementUserInputError()
    }else{
        let found = false
        for(const reimbursement of reimbursements){
            if(reimbursement.reimbursementId === +id){
            res.json(reimbursement)
            found = true
            }
        }
        if(!found){
            throw new reimbursementNotFound()
        }
    }
  
})


let reimbursements:Reimbursement[] =[{
    reimbursementId: 1,
    author: 21,
    amount: 10,
    dateSubmitted: 4,
    dateResolved: 5,
    description: 'I want my money back',
    resolver: 4,
    status:1,
    type: 12
}]