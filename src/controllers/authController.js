import mongo from '../db/db.js';
import bcrypt from 'bcrypt';
import {signUpSchema} from '../schemas/authSchema.js'

let db = await mongo();

async function signUp(req, res) {
    const {name, email, password} = req.body;

    const isValid = signUpSchema.validate({name, email, password}, {abortEarly: false});

    if(isValid.error) {
        return res.status(422).send(isValid.error.message);
    }

    try{
        const checkEmail = await db.collection('users').findOne({email});

        if(checkEmail) {
            return res.status(409).send('Email já cadastrado!');
        } 

        const passwordHash = bcrypt.hashSync(password, 10);

        await db.collection('users').insertOne({
            name, 
            email, 
            password: passwordHash});

        res.sendStatus(201);

    }catch(error){
       return res.status(500).send(error.message);
    }
}

export {signUp};