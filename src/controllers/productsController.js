import { ObjectId } from "mongodb"
import mongo from "../db/db.js";

let db = await mongo();

async function listProducts(req, res) {
    try {
        const products = await db.collection('products').find().toArray();
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}

async function addCart(req, res) {
    const {userId} = res.locals.user;
    const { productId } = req.params;

    try {
        const userCart = await db.collection("cart").findOne({userId});
        const product = await db.collection("products").findOne({_id: ObjectId(productId)});

        if(!userCart){
            await db.collection("cart").insertOne({userId, products: [product]})
            return res.sendStatus(200)
        }
        
        const newProducts = [...userCart.products, product]
        const newCart = {
            ...userCart,
            products: newProducts
        }
        await db.collection("cart").updateOne({userId}, { $set: newCart })
        res.sendStatus(200)

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}

export {
    listProducts,
    addCart
}