const Router = require("express").Router

const router = Router()

const ProductManager=require('../clases/ProductManager')

const um=new ProductManager()


router.get("/", (req, res)=>{
    let productos = um.getProducts()

    let {limit} = req.query
    
    let resultado = productos
    if(limit && limit>0){
        resultado = resultado.slice(0, limit)
    }

    res.json(resultado)
})

router.get("/:pid", (req, res) => {
    let productos = um.getProducts()

    let {pid} = req.params

    const productFind = productos.find(product => product.id == pid)

    if (!productFind) {
        console.log(`No se encontró ningún producto con el id ${pid}.`);
        res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}.` });
        return;
    }

    res.json(productFind)
})

router.post("/", (req, res)=>{
    const { title, description, price, thumbnail, code, stock, category } = req.body;


    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        return res.status(400).json({ error: "Faltan completar campos obligatorios" });
    }

        let nuevoProducto = um.addProduct(title, description, price, thumbnail, code, stock, category);

        req.io.emit("nuevoProducto", nuevoProducto)

        res.status(201).json({ mensaje: "Producto agregado correctamente" });
})


router.put("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    if (!title && !description && !price && !thumbnail && !code && !stock && !category) {
        return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar el producto." });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (price) updatedFields.price = price;
    if (thumbnail) updatedFields.thumbnail = thumbnail;
    if (code) updatedFields.code = code;
    if (stock) updatedFields.stock = stock;
    if (category) updatedFields.category = category;


    um.updateProduct(productId, updatedFields);

    res.status(200).json({ message: `Producto con ID ${productId} actualizado correctamente` });
})

router.delete("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)

    try {
        let productoEliminado = um.deleteProduct(productId);
        req.io.emit("productoEliminado", productId)
        res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

module.exports=router