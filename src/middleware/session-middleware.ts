import session,{SessionOptions} from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret', // not to be done in production
    cookie:{
        secure:false
    },
    resave:false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)