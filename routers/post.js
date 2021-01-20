const router=require('express').Router();
const verify=require('./verified');
const User = require('../modal/User');

router.get('/', verify, async (req,res) => {
    try{
        const user=await User.find();
        res.json(user);
    }catch(err){
        res.send({"message": err});
    }
});

module.exports= router;
