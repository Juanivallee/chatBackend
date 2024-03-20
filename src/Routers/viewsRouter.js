const Router = require("express").Router
const ProductManager=require('../clases/ProductManager')

const um=new ProductManager()

const router = Router()


router.get("/", (req,res) =>{

    let productos=um.getProducts()

    res.status(200).render("home",{
        productos
    })
})

router.get("/chat", (req, res)=>{


    res.status(200).render('chat')
})


router.get("/realtimeproducts", (req,res) =>{
    let productos = um.getProducts()

    res.status(200).render("realTimeProducts",{
        productos
    })
})

module.exports=router