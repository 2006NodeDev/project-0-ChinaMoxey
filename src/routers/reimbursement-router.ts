import express, {Response,Request, NextFunction} from 'express'
import { reimbursementInputError } from '../errors/reimbursementInputError';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllReimbursements,getReimbursementStatus,getReimbursementByUser,SubmitReimburse,UpdateReimbursement } from '../daos/reimbursement-dao';
import { UnauthorizedUser } from '../errors/UnauthorizedUser';
import { Reimbursement } from '../models/Reimbursement';
//import { reimbursementUserInputError } from '../errors/reimbursementUserInputError';
//import { Reimbursement } from '../models/Reimbursement';
//import { reimbursementNotFound } from '../errors/reimbursementNotFound';
//import { reimbursementUserInputError } from '../errors/reimbursementUserInputError';
//import { Reimbursement } from '../models/Reimbursement';
//import { AuthenticationFailure } from '../errors/AuthenticationFailure';


export let reimbursementRouter = express.Router();
 //get all reimbursements
reimbursementRouter.get('/',authorizationMiddleware(['finance-manager']),async(req:Request,res:Response,next:NextFunction)=>{
    try {
        let reimbursements = await getAllReimbursements()
        res.json(reimbursements)
    } catch (e) {
        next(e)
    }
})

//get by statusId
reimbursementRouter.get('/status/:statusId',authorizationMiddleware(['finance-manager']),async(req:Request,res:Response, next:NextFunction)=>{
    let statusId = parseInt(req.params.statusId)
    if(isNaN(+statusId)){
        throw new reimbursementInputError()
    }else{
        try {
            let reimbursement = await getReimbursementStatus(statusId);
            res.json(reimbursement);
          } catch (e) {
            next(e)
          }
            

        }
    })

//add patch reimbursements only finance-manager 
    reimbursementRouter.patch('/',authorizationMiddleware(['finance-manager']),async(req:Request, res:Response, next:NextFunction) =>{
        let { reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type } = req.body
        if(!reimbursementId) { 
            throw new reimbursementInputError()
        }
        else if(isNaN(+reimbursementId)) { 
            throw new reimbursementInputError()
        }
        else { 
            let reimburse:Reimbursement = { 
                reimbursementId, 
                author,
                amount,
                dateSubmitted,
                dateResolved,
                description,
                resolver,
                status,
                type
            }
            reimburse.author = author || undefined
            reimburse.amount = amount || undefined
            reimburse.dateSubmitted = dateSubmitted || undefined
            reimburse.dateResolved = dateResolved || undefined
            reimburse.description = description || undefined
            reimburse.resolver = resolver || undefined
            reimburse.status = status || undefined
            reimburse.type = type || undefined
            try {
                let alter = await UpdateReimbursement(reimburse)
                res.status(201).send("Updated Reimbursement")
                res.json(alter)
            } catch (e) {
                next(e)
            }
        }
    })
//add post reimbursements admin,user ,and finance-manager 
reimbursementRouter.post('/',authorizationMiddleware(['finance-manager','User','Admin']),async(req:Request,res:Response,next:NextFunction)=>{
    let {author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type} = req.body;
        
        if(!author || !amount || !dateSubmitted || !dateResolved || !description || !resolver || !status || !type){
            next(new reimbursementInputError)
        }
        else{
            let newReimbursement: Reimbursement = {
                reimbursementId: 0,
                author,
                amount,
                dateSubmitted,
                dateResolved,
                description,
                resolver,
                status,
                type}
            try{
                let submit = await SubmitReimburse(newReimbursement)
                res.status(201).send("Created Reimbursement")
                res.json(submit)
            } catch (e){
                next(e)
            }   
        }
})


//get reimbursements/author/userId/:userId finance-manager and user if the user created that reimbursement
reimbursementRouter.get('/author/userId/:userId',authorizationMiddleware(['finance-manager','User']), async(req:Request,res:Response,next:NextFunction)=>{
    let {userId} = req.params
    if(isNaN(+userId)){
        res.status(400).send('userId needs to be a number')
    }else if(req.session.user.role==="User" && req.session.user.userId !== +userId){
            next(new UnauthorizedUser)
    }
        try {
            let allReimbursementsByUser = await getReimbursementByUser(+userId) 
            res.json(allReimbursementsByUser)
        } catch (e) {
            next(e)
        }
    
})