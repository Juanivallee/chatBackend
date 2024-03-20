const fs = require ('fs')
const products = require('../base_de_datos/productos.json')
const carts = require('../base_de_datos/carts.json')

const Router = require("express").Router

const router = Router()

const CartManager=require('../clases/CartManager')

const um=new CartManager()


router.post("/", (req, res)=>{
    try {
        const newCart = um.createCart();
        res.status(201).json({ message: "Carrito creado correctamente", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
})

router.get("/:cid", (req, res)=>{
    const cid = parseInt(req.params.cid)

    const productsCart = um.getProductsCartById(cid)
    
    if (!productsCart) {
        console.log(`No se encontró ningún carrito con el id ${cid}.`);
        res.status(404).json({ error: `No se encontró ningún carrito con el id ${cid}.` });
        return;
    }

    res.json(productsCart)
})

router.post("/:cid/product/:pid", (req, res) => {
    const {cid, pid} = req.params


    const cartIndex = carts.findIndex(cart => cart.id == cid)
    if(cartIndex === -1){
        return res.status(404).json({error: `No se encontró ningún carrito con el id ${cid}`})
    }


    const product = products.find(product => product.id == pid)
    if(!product){
        return res.status(404).json({error: `No se encontró ningún producto con el id ${pid}`})
    }


    const existingProductIndex = carts[cartIndex].products.findIndex(item => item.product == pid)
    if(existingProductIndex !== -1){
        carts[cartIndex].products[existingProductIndex].quantity++
    }else{
        carts[cartIndex].products.push({product: pid, quantity: 1})
    }


fs.writeFileSync("./base_de_datos/carts.json", JSON.stringify(carts, null, "\t"))

res.status(200).json({message: `Producto con ID ${pid} agregado al carrito ${cid} correctamente`})
})


module.exports=router