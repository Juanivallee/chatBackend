const fs = require('fs')


class CartManager{

    constructor(){
        this.carts = []
        this.path = "./base_de_datos/carts.json"
    }

    createCart(){
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, { encoding: "utf-8" });
            if (data) {
                this.carts = JSON.parse(data);
            }
        }

        let newId = 1;
        if (this.carts.length > 0) {
            newId = Math.max(...this.carts.map(cart => cart.id)) + 1;
        }

        const newCart = { id: newId, products: []}

        this.carts.push(newCart)

        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"))
    }


    getProductsCartById(id){
        const traerArreglo = JSON.parse(fs.readFileSync(this.path,{encoding:"utf-8"}))

        const cart = traerArreglo.find(cart => cart.id == id);


        if (!cart) {
            console.log(`No se encontró ningún carrito con el ID ${id}.`);
            return null;
        }

        return cart.products;
    }
}


module.exports=CartManager