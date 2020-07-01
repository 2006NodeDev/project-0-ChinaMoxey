import {PoolClient,QueryResult} from 'pg'
import {connectionPool} from '.'
import {ReimbursementDTOConvertor} from '../utils/ReimbursementDTOConvertor'
import { Reimbursement } from '../models/Reimbursement';
import { UserNotFoundError } from '../errors/UserNotFoundError'
import { reimbursementNotFound } from '../errors/reimbursementNotFound';

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
//get reimbursment by user id
export async function getReByUserId(id: number){
    let client:PoolClient

    try{
        client = await connectionPool.connect() 
        let result:QueryResult = await client.query(`select * from expensereimbursementsystem."reimbursement" r left join expensereimbursementsystem."users" u on r."author" = u."userId"  where u."userId" = $1;`, [id])

        if (result.rowCount === 0){
            throw new reimbursementNotFound()
        } else{
            return result.rows.map(ReimbursementDTOConvertor)
        }

    }catch (e){
        if(e.message === 'Reimbursement not found.'){
            throw new reimbursementNotFound()
        }
        throw new Error('Unhandled error')

    }finally{
        client && client.release()

    }

}
//get by status id
export async function getReimbursementStatus(statusId: number):Promise<Reimbursement[]> {
    let client: PoolClient
    try {

        client = await connectionPool.connect()
        let results = await client.query(
            `select * from expensereimbursementsystem.reimbursements r where status = $1`,
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