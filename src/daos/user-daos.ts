import {PoolClient} from 'pg'
import {connectionPool} from "."
import {User} from '../models/User'
import { UserNotFoundError } from '../errors/UserNotFoundError'
import {UserDTOConvertor} from '../utils/UserDTOConventor'
import { InputError } from '../errors/InputError'

//get all users
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
//getting by username and password
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
//get by user id
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
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedUser.username) {
            await client.query(`update expensereimbursementsystem.users set "username" = $1 
                                    where "userId" = $2;`, 
                                    [updatedUser.username, updatedUser.userId])
        }
        if(updatedUser.password) {
            await client.query(`update expensereimbursementsystem.users set "password" = $1 
                                    where "userId" = $2;`, 
                                    [updatedUser.password, updatedUser.userId])
        }
        if(updatedUser.firstName) {
            await client.query(`update expensereimbursementsystem.users set "firstName" = $1 
                                    where "userId" = $2;`, 
                                    [updatedUser.firstName, updatedUser.userId])
        }
        if(updatedUser.lastName) {
            await client.query(`update expensereimbursementsystem.users set "lastName" = $1 
                                    where "userId" = $2;`, 
                                    [updatedUser.lastName, updatedUser.userId])
        }
        if(updatedUser.email) {
            await client.query(`update expensereimbursementsystem.users set "email" = $1 
                                    where "userId" = $2;`, 
                                    [updatedUser.email, updatedUser.userId])
        }
        if(updatedUser.role) {
            let roleId = await client.query(`select r."role_id" from expensereimbursementsystem.roles r 
                                        where r."role" = $1`,
                                        [updatedUser.role])
            if(roleId.rowCount === 0) {
                throw new Error('Role Not Found')
            }
            roleId = roleId.rows[0].role_id
            await client.query(`update expensereimbursementsystem.users set "role" = $1 
                                    where "userId" = $2;`, 
                                    [roleId, updatedUser.userId])
        }

        await client.query('COMMIT;')
        return updatedUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new InputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}