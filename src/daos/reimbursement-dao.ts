import {PoolClient,QueryResult} from 'pg'
import {connectionPool} from '.'
import {ReimbursementDTOConvertor} from '../utils/ReimbursementDTOConvertor'
import { Reimbursement } from '../models/Reimbursement';
import { UserNotFoundError } from '../errors/UserNotFoundError'
//import { reimbursementUserInputError } from '../errors/reimbursementUserInputError';
//import { reimbursementNotFound } from '../errors/reimbursementNotFound';
//import { reimbursementUserInputError } from '../errors/reimbursementUserInputError';
//import { UnauthorizedUser } from '../errors/UnauthorizedUser';


//get all reimbursements
export async function getAllReimbursements(): Promise<Reimbursement[]>{
    let client: PoolClient 
    try{
        client = await connectionPool.connect() 
        let results:QueryResult = await client.query(`select * from expensereimbursementsystem."reimbursements";`) 
        
        return results.rows.map(ReimbursementDTOConvertor) 
    } catch(e){
        console.log(e);
        throw new Error('Unhandle Error') 
        
    } finally {
        client && client.release() 

    }
}
//get by status id
export async function getReimbursementStatus(statusId: number):Promise<Reimbursement[]> {
    let client: PoolClient
    try {

        client = await connectionPool.connect()
        let results = await client.query(
            `select * from expensereimbursementsystem."reimbursements" r where status = $1`,
            [statusId]);  
                if(results.rowCount === 0){
            throw new UserNotFoundError()
        }

        return results.rows.map(ReimbursementDTOConvertor)

    } catch (e) {
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        console.log(e)
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Adding a new Reimbursement 
 export async function SubmitReimburse(newReimburse:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    console.log(newReimburse)

    try{
        client = await connectionPool.connect() //gives you a promise, so you take it out of the stack to prevent blocking
        
        let result:QueryResult = await client.query(`insert into expensereimbursementsystem."reimbursements" ("author", "amount", "dateSubmitted", "dateResolved", "description", "resolver", "status", "type")
                                                        values ($1, $2, $3, $4, $5, $6, $7, $8) returning "reimbursementId"` , [newReimburse.author, newReimburse.amount, newReimburse.dateSubmitted, newReimburse.dateResolved, 
                                                            newReimburse.description, newReimburse.resolver, newReimburse.status, newReimburse.type])
        
        newReimburse.reimbursementId = result.rows[0].reimbursementId
        return newReimburse
       

    }catch (err){
        
        console.log(err)
        throw new Error('Unimplimented id error')
        
 
    }finally{
        client && client.release()

    }
 }

 export async function getReimbursementByUser(id: number):Promise<Reimbursement[]>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect()
        let results:QueryResult = await client.query(`select * from expensereimbursementsystem."reimbursements" r left join expensereimbursementsystem.users u on r."author" = u."userId" where author = $1 `,[id])
        console.log(results.rows)
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return results.rows.map(ReimbursementDTOConvertor);
    } catch(e){
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
 }

 export async function UpdateReimbursement(UpdateReimburse:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(UpdateReimburse.author) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "author" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.author, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.amount) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "amount" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.amount, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.dateSubmitted) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "dateSubmitted" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.dateSubmitted, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.dateResolved) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "dateResolved" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.dateResolved, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.description) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "description" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.description, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.resolver) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "resolver" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.resolver, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.status) {
            await client.query(`update expensereimbursementsystem."reimbursements" set "status" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.status, UpdateReimburse.reimbursementId])
        }
        if(UpdateReimburse.type) {
            await client.query(`update expensereimbursementsystem.reimbursements set "type" = $1 
                                where "reimbursementId" = $2;`, 
                                [UpdateReimburse.type, UpdateReimburse.reimbursementId])
        }

        await client.query('COMMIT;')
        return UpdateReimburse
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new Error('Type not found')
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}