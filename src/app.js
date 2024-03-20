const express = require("express")
const {dirnameValue} = require('./utils')
const handlebars = require("express-handlebars")
const path = require("path")
const productRouter=require("./Routers/productsRouter")
const cartRouter=require("./Routers/cartRouter")
const viewsRouter=require("./Routers/viewsRouter")
const {Server} =require("socket.io")

const PORT = 8080

let io;
const app = express()

app.use(express.json()); 
app.use(express.urlencoded({extended:true}))
app.use("/js", express.static(path.join(__dirname, "public/js")))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use("/api/products", (req, res, next)=>{
    req.io=io
    next()
}, productRouter)

app.use("/api/carts", cartRouter)

app.use ("/", viewsRouter)

const server =app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`);
})

let mensajes = [] 
let usuarios = []

io=new Server(server)

io.on("connection", socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`);
    
    socket.on("presentacion", nombre=>{
        usuarios.push({id:socket.id, nombre})
        socket.emit("historial", mensajes)
        //console.log(nombre)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", (nombre, mensaje)=>{
        mensajes.push({nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario = usuarios.find(u=>u.id===socket.id)
        if(usuario){
            socket.broadcast.emit("saleUsuario", usuario.nombre)
        }
    })

})



