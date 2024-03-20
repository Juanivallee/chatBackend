document.addEventListener('DOMContentLoaded', ()=>{
    const socket = io()
    
    socket.on("nuevoProducto", datos=>{
        console.log(datos);
        let ulProductos = document.getElementById("products-list")
        ulProductos.innerHTML+=`<li id="product-${datos.id}">${datos.title} - Precio: $${datos.price}</li>` 
    })

    socket.on("productoEliminado", id=>{
        console.log(`Producto con id ${id} eliminado correctamente`);
        const liElement = document.getElementById(`product-${id}`)
        if(liElement){
            liElement.remove()

            //Actualizar ids
            const productList = document.querySelectorAll('#products-list li')
            productList.forEach((li, index) => {
                const productId = li.id.split('-')[1]
                if(productId !== undefined){
                    li.id = `product-${index + 1}`
                }
            })
        }
    })
})

