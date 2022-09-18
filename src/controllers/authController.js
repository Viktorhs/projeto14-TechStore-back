import mongo from '../db/db.js';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {signUpSchema, singInSchema} from '../schemas/authSchema.js'

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

async function signIn(req, res) {
    const {email, password} = req.body;

    const isValid = singInSchema.validate({email, password}, {abortEarly: false});

    if(isValid.error){
        return res.status(422).send(isValid.error.message);
    }

    try{
        const user = await db.collection('users').findOne({email});
        
        if(!user){
            return res.status(404).send('Usuário não encontrado!')
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if(user && passwordIsValid){
            const token = uuid();
            const name = user.name;

            await db.collection('sessions').insertOne({
                token,
                userId: user._id
            })

            const body = {token, name}

            res.send(body);
        
        }else{
            res.sendStatus(401);
        }

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

async function logout(req, res) {
    const { token } = res.locals.user;

    try {
        await db.collection("sessions").deleteOne({token});
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}
export {signUp, signIn, logout};