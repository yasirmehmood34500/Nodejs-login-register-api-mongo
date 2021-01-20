const router=require('express').Router();
const User= require('../modal/User');
const bcrypt=require('bcryptjs');
const Joi=require('@hapi/joi');
const jwt=require('jsonwebtoken');




const schema_validation_register=Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});


const schema_validation_login=Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});



router.post('/register', async (req, res) => {

    const {error} = schema_validation_register.validate(req.body);
    if(error) return res.status(400).send({"message": error.details[0].message});

    const emailExit=await User.findOne({email: req.body.email});
    if(emailExit) return res.status(400).send({"message":"Email already exit"});

    const salt = await bcrypt.genSalt(10);
    const hasPass= await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hasPass
    });
    try{
        const savedUser=await user.save();
        res.send({user: user._id});
    }catch{
        res.status(400).send(err);
    }
}); 


router.post('/login', async (req, res) => {

    const {error} = schema_validation_login.validate(req.body);
    if(error) return res.status(400).send({"message": error.details[0].message});

    const user_get=await User.findOne({email: req.body.email});
    if(!user_get) return res.status(400).send({"message":"Email doesn't exit"});

    const validPass=await bcrypt.compare(req.body.password, user_get.password);
    if(!validPass) return res.status(400).send({"message":"invalid password"});

    const token= jwt.sign({_id: user_get._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({"message": "Successfully Logged in!", "auth-token": token}); 

});

module.exports= router;