const { log } = require('console');
const fs = require('fs')
const { stringify } = require('querystring')

class ProductManager{


    constructor(){
        this.products=[]
        this.path = "./base_de_datos/productos.json"
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([], null, "\t"), (error) => {
                if (error) {
                    throw new Error(`Error al crear el archivo de base de datos: ${error.message}`);
                }
            });
        }
    }



    addProduct(title, description, price, thumbnail, code, stock, category){

        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, { encoding: "utf-8" });
            if (data) {
                this.products = JSON.parse(data);
            } else {
                this.products = [];
            }
        } else {
            this.products = [];
    }

        let existe=this.products.find(product=>product.code===code)
        if(existe){
            console.log(`El producto con code ${code} ya existe, ingrese otro code para identificar el producto`);
            return
        }


        let parametros = {title, description, price, thumbnail, code, stock, category}
        if (Object.values(parametros).some(value => value === undefined || value == ""  || value == " ")) {
            console.log('Usted no ha completado todos los campos');
            return;
        }


        let id=1 
        if(this.products.length>0){
            id=this.products[this.products.length-1].id +1
        } 


        let newProduct={id, title, description, price, thumbnail, code, stock, category, status: true}
        this.products.push(newProduct)
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"))
        return newProduct
    }



    getProducts(){
        return JSON.parse(fs.readFileSync(this.path, {encoding:"utf-8"}))
    }



    getProductById(id){
        const traerArreglo = JSON.parse(fs.readFileSync(this.path,{encoding:"utf-8"}))
        
        const productFind = traerArreglo.find(productFind => productFind.id === id)

        if (!productFind) {
            console.log(`Not found. No existen productos con el numero de id ${id}.`)
            return
        }

        return productFind
    }



    updateProduct(id, newProductInfo){
        let traerArreglo = JSON.parse(fs.readFileSync(this.path,{encoding:"utf-8"}))

        let productFindIndex = traerArreglo.findIndex(productFind => productFind.id === id)

        if(productFindIndex === -1) {
            console.log(`Not found. No existen productos con el numero de id ${id}.`);
            return;
        }

        let productToUpdate = traerArreglo[productFindIndex]

        for(let key in newProductInfo){
            productToUpdate[key]= newProductInfo[key]
        }

        traerArreglo[productFindIndex] = productToUpdate

        this.products = traerArreglo;

        fs.writeFileSync(this.path, JSON.stringify(traerArreglo, null, "\t"))
        console.log(`Producto con ID ${id} actualizado correctamente`);
    }



    deleteProduct(id){
        let traerArreglo = this.getProducts()

        let productFindIndex = traerArreglo.findIndex(productFind => productFind.id === id)

        if (productFindIndex === -1) {
            console.log(`Not found. No existen productos con el numero de id ${id}.`);
            throw new Error(`No existen el producto con numero de ID ${id}`)
        }

        traerArreglo.splice(productFindIndex, 1)

        // Reajustar los IDs después de eliminar el producto
        traerArreglo.forEach((product, index) => {
            product.id = index + 1;
        });
        

        fs.writeFileSync(this.path, JSON.stringify(traerArreglo, null, "\t"));
        console.log(`Producto con ID ${id} eliminado correctamente`);
    }

}

module.exports=ProductManager


