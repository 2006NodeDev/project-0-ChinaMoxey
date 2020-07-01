import express, {Response,Request, NextFunction} from 'express'
import { reimbursementInputError } from '../errors/reimbursementInputError';
import { authorizationMiddleware } from '../middleware/authorization-middleware';
import { getAllReimbursements, getReByUserId,getReimbursementStatus } from '../daos/reimbursement-dao';
import { reimbursementNotFound } from '../errors/reimbursementNotFound';

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
//get by user Id
reimbursementRouter.get('/author/userId/:userId',authorizationMiddleware(['finance-manager']),async(req:Request,res:Response,next:NextFunction)=> {
    let userId = parseInt(req.params.userId)
    if(isNaN(+userId)){
        throw new reimbursementNotFound()
    }else{
        try {
            let reimbursement = await getReByUserId(userId);
            res.json(reimbursement);
          } catch (e) {
              
            next(e);
          }
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

