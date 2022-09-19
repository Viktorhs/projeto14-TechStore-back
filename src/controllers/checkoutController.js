import mongo from '../db/db.js';
import {ObjectId} from 'mongodb';
import dayjs from 'dayjs';
import { v4 as uuid} from 'uuid';

let db = await mongo();

async function checkout(req, res) {
    const {userId} = res.locals.user;
    const {cardName, cardNumber} = req.body;

    try{
        
        const userCart =  await db.collection("cart").find({userId}).toArray();

        if(!userCart){
            return res.status(404).send('Carrinho vazio!')
        }
        const userOrder = {
            orderId: uuid(),
            userId: userId,
            orderDate: dayjs().format("DD-MM-YYYY"),
            cardName,
            cardNumber,
            userOrder: userCart
        }

        await db.collection('orders').insertOne(userOrder);
        await db.collection('cart').deleteOne({userId: ObjectId(userId)});

        const dados = {
            orderId: userOrder.orderId,
            orderDate: userOrder.orderDate
        }

        res.send(dados);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

async function userInfos(req, res){
    const {userId} = res.locals.user;

    try{
        const userInfos = await db.collection("orders").find({userId}).toArray();
        res.send(userInfos);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {checkout, userInfos}; 