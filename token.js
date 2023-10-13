const express = require('express')
const app = express()
module.exports= app.use((req, res, next)=>{
    //console.log(req.headers)
    if(req.headers['token'] != '42'){
        res.status(403).send()}
    next()
  })