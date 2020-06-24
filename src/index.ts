import express from 'express'

const app = express(); // calling express function



//listening at port 2006
app.listen(2006, () =>{
    console.log('Started Server');
});