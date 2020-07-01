import {PoolClient} from 'pg'
import {connectionPool} from "."
import {User} from '../models/User'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import {UserDTOConvertor} from '../utils/UserDTOConventor'

export async function getAllUsers():Promise<User[]>{
    let client:PoolClient
    try{
        
        client = await connectionPool.connect()
        let results = await client.query(`select u."userId", 
        u."username" , 
        u."password" ,                 
        u."email" ,
        r."role_id" , 
        r."role" 
        from expensereimbursementsystem.users u left join expensereimbursementsystem.roles r on u."role" = r.role_id;`)
        return results.rows.map(UserDTOConvertor)
    }catch(e){
        console.log(e)
        throw new Error('Unhandled error handling')
    }
    finally{
        client && client.release()
    }
} 
export async function getUsernameAndPassword(username:string, password:string):Promise<User>{
    let client: PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."userId", 
                u."username" , 
                u."password" ,                 
                u."email" ,
                r."role_id" , 
                r."role" 
                from expensereimbursementsystem.users u left join expensereimbursementsystem.roles r on u."role" = r.role_id 
                where u."username" = $1 and u."password" = $2;`,
            [username, password])
        if(results.rowCount === 0){
            throw new Error('un-implement error handling')
        }
        return UserDTOConvertor(results.rows[0])
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
export async function getUserById(id: number):Promise<User> {
    let client: PoolClient
    try {
        
        client = await connectionPool.connect()
        let results = await client.query(`select u."userId", 
        u ."username", 
        u."password", 
        u."firstName" ,
        u."lastName" ,
        u."email",
        r."role_id", 
        r."role" 
     from expensereimbursementsystem.users u 
    join expensereimbursementsystem.roles r 
     on u."role" = r."role_id" 
       where u."userId"= $1;`, [id])
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return UserDTOConvertor(results.rows[0])
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
export async function UserUpdate(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()

        await client.query(`expensereimbursementsystem.users 
                            set "username" = $1, 
                            "password" = $2, 
                            "firstName" = $3, 
                            "lastName" = $4, 
                            "email" = $5, 
                            "role" = $6
                            where userId = $7 returning "userId" `,
                            [updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.role.role_id, updatedUser.userId])
        return getUserById(updatedUser.userId);

    }catch(e){
        console.log(e)
        throw new Error('Unhandled Error Occured')
    }finally{
        client && client.release();
    }
}