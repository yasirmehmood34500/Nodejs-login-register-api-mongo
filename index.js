const express = require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose= require('mongoose');
const authRouter= require('./routers/auth');
const postRouter=require('./routers/post');

const port = process.env.PORT || 5005;
dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology: true}
);

app.use(express.json());

app.use('/api/user/', authRouter);
app.use('/api/post/', postRouter);


app.listen(port, () => {console.log(`running port: ${port}`)}); 