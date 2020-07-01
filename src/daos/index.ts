import {Pool} from 'pg'

export const connectionPool:Pool = new Pool({
    host:'35.230.190.232',
    user:'postgres',
    password: 'password221',
    database: 'postgres',
    port: 5432,
    max:5

})