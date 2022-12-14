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

async function findProduct(req, res) {
    const {productId} = req.params

    try {
        const product = await db.collection('products').findOne({_id: ObjectId(productId)});
        res.status(200).send(product);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}

async function listCart(req, res) {
    const {userId} = res.locals.user;
    let total = 0
    try {
        const cart = await db.collection('cart').findOne({userId});

        if(!cart){
            return res.status(404).send('Carrinho vazio');
        }
        for(let i = 0; i < cart.products.length ; i++){
            total += cart.products[i].total
        }

        const finalCart = {
            ...cart,
            total
        }
        res.status(200).send(finalCart);
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
        let product = await db.collection("products").findOne({_id: ObjectId(productId)});


        if(!userCart){
            product = {
                ...product,
                quantity: 1,
                total: product.price
            }
            await db.collection("cart").insertOne({userId, products: [product]})
            return res.sendStatus(200)
        }
  
        const checkProduct = userCart.products.find((item)=> product._id.toString() === item._id.toString())
    
        if(!checkProduct) {
            product = {
                ...product,
                quantity: 1,
                total: product.price
            }
            const newProducts = [...userCart.products, product]
            const newCart = {
                ...userCart,
                products: newProducts
            }
            await db.collection("cart").updateOne({userId}, { $set: newCart })
            return res.sendStatus(200)
        }

        for(let i = 0 ; i < userCart.products.length; i++){
            if(product._id.toString() === userCart.products[i]._id.toString()){
                userCart.products[i].quantity += 1
                userCart.products[i].total += product.price
            }
        }

        await db.collection("cart").updateOne({userId}, { $set: userCart })
        return res.sendStatus(200)


    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function removeCart(req, res) {
    const {userId} = res.locals.user;
    const { productId } = req.params;

    try {
        const userCart = await db.collection("cart").findOne({userId});
        const product = await db.collection("products").findOne({_id: ObjectId(productId)});
        
        if(userCart.userId.toString() !== userId.toString()){
            return res.sendStatus(401)
        }

        const newProducts = userCart.products.filter(item => item._id.toString() !== product._id.toString())
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

async function removeOneCart(req, res) {
    const {userId} = res.locals.user;
    const { productId } = req.params;

    try {
        const userCart = await db.collection("cart").findOne({userId});
        const product = await db.collection("products").findOne({_id: ObjectId(productId)});
        
        if(userCart.userId.toString() !== userId.toString()){
            return res.sendStatus(401)
        }

        const newProducts = []

        for(let i = 0 ; i < userCart.products.length; i++){
            if(product._id.toString() === userCart.products[i]._id.toString()){
                userCart.products[i].quantity -= 1
                userCart.products[i].total -= product.price
            }
            if(userCart.products[i].quantity > 0){
                newProducts.push(userCart.products[i])
            }
        }

        const newCart = {
            ...userCart,
            products: newProducts
        }

        await db.collection("cart").updateOne({userId}, { $set: newCart })
        return res.sendStatus(200)

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    listProducts,
    listCart,
    addCart,
    removeCart,
    removeOneCart,
    findProduct
}