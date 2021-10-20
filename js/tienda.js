/**************************************************************
*        ENTIDADES
***************************************************************/
class productoEnCarrito {
    constructor({ titulo, precio, imagen, alt, categoria, cantidad }) {
        this.titulo = titulo,
            this.precio = precio,
            this.imagen = imagen,
            this.alt = alt,
            this.categoria = categoria,
            this.cantidad = cantidad
    }
}

/**************************************************************
*        VARIABLES Y CONSTANTES
***************************************************************/
const serverURL = 'http://127.0.0.1:5501/'   //'https://www.almapatisserie.com.ar/'
const mockImgTiendaPath = 'assets/mock/tienda.json'
const tiendaImgFullPath = 'assets/img/tienda/'
const tarjetasContainer = document.querySelector('.tarjetasTienda');
const shoppingCart = document.querySelector(".shopping-cart")
const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer')
const comprarButton = document.querySelector(".comprarButton")
var listaProductosEnCarrito //variable para almacenar los productos que hay en el carito
var listaProductosDeJson //variable para almacenar el array con todos los objetos del JSON

/**************************************************************
*        FUNCIONES
***************************************************************/

function getTarjetas() { //TRAE EL JSON CON LA INFO DE LAS TARJETAS Y LLAMA A LA FUNCION QUE LAS IMPRIME EN EL HTML
    fetch(`${serverURL}${mockImgTiendaPath}`).then((res) => res.json()).then((data) => printTarjetas(data));
}

function printTarjetas(data) { //IMPRIME LAS TARJETAS EN EL HTML
    listaProductosDeJson = data
    const itemsContainer = document.createElement('div')

    data.forEach(item => {
        let index = data.indexOf(item)

        const tarjeta = document.createElement("article")
        tarjeta.setAttribute("class", "tarjeta")

        const img = document.createElement("img")
        img.setAttribute("src", serverURL + tiendaImgFullPath + item.imagen)
        img.setAttribute("alt", item.alt)
        img.setAttribute("class", "itemImg")

        const miniContenedor = document.createElement('div')

        const titulo = document.createElement("h3")
        titulo.textContent = item.titulo
        titulo.setAttribute("class", "itemTitle")

        const descripcion_corta = document.createElement("p")
        descripcion_corta.textContent = item.descripcion_corta

        const precio = document.createElement("p")
        precio.textContent = "Precio $" + item.precio
        precio.setAttribute("class", "itemPrecio")

        const btn = document.createElement("input")
        btn.setAttribute("type", "button")
        btn.setAttribute("value", "Añadir al Carrito")
        btn.setAttribute("class", "addToCart")
        btn.setAttribute("onClick", `addToCartClicked(${index})`)

        miniContenedor.appendChild(titulo)
        miniContenedor.appendChild(descripcion_corta)
        miniContenedor.appendChild(precio)
        miniContenedor.appendChild(btn)
        tarjeta.appendChild(img)
        tarjeta.appendChild(miniContenedor)
        itemsContainer.appendChild(tarjeta)
        tarjetasContainer.appendChild(itemsContainer)
        /*
        <article class="tarjeta">
            <img src="../assets/img/smash.PNG" alt="smash">
            <div>
                <h3>Smash con bombones y chocolates</h3>
                <p>Corazón y base de chocolate blanco / semiamargo o con leche</p>
                <p>Precio $1700</p>
                <input type ="button" value="Mas detalles" data-bs-toggle="modal" data-bs-target="#modal1">
            </div>
        </article>*/
    });
}

function addToCartClicked(index) {
    let producto = new productoEnCarrito({
        titulo: listaProductosDeJson[index].titulo,
        precio: listaProductosDeJson[index].precio,
        imagen: listaProductosDeJson[index].imagen,
        alt: listaProductosDeJson[index].alt,
        categoria: listaProductosDeJson[index].categoria,
        cantidad: 1,
    })

    let carrito;
    if (localStorage.getItem("carrito") == null) {
        carrito = []
    } else {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }

    if (carrito.length > 0) {
        index = carrito.findIndex(function (p) {
            return p.titulo === producto.titulo
        })
        if (index > -1) {
            carrito[index].cantidad += 1

            //swwet alert start
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'Producto agregado al carrito'
            })
            //swwet alert end

        } else {
            carrito.push(producto)
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
    } else {
        carrito.push(producto)
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }

    printCarrito()
}


function printCarrito() { //
    if (localStorage.getItem("carrito") !== null) {
        shoppingCart.classList.remove("d-none")
        printShoppingCart() //funcion para imprimir lo que hay en el carrito
    }
}

function printShoppingCart() { //imprime lo que hay en el local storage dentro del carrito
    listaObjetos = JSON.parse(localStorage.getItem("carrito"))
    shoppingCartItemsContainer.innerHTML = ""

    let indice = 0
    listaObjetos.forEach(element => {
        const shoppingCartRow = document.createElement("div")
        const shoppingCartContent = `
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src="${serverURL}${tiendaImgFullPath}${element.imagen}" class="shopping-cart-image" alt="${element.alt}">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">
                        ${element.titulo}</h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice">$${element.precio}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                        value="${element.cantidad}" onchange="cambiarCantidadInput(${indice})">
                    <button class="btn btn-danger" onClick="removeShoppingCartItem(${indice})" type="button">X</button>
                </div>
            </div>
        </div>
        `
        shoppingCartRow.innerHTML = shoppingCartContent
        shoppingCartItemsContainer.append(shoppingCartRow)

        updateShoppingCartTotal()
        indice++
    });
}

function cambiarCantidadInput(indice) {
    let input = document.querySelector(".shopping-cart-quantity-input")
    if (input.value <= 0) {
        alert("para eliminar un item presione la X")
        input.value = 1
    }
    if (input.value > 10) {
        alert("Por compras mayoristas comunicarse directamente al numero de WhatsApp")
        input.value = 10
    }
    carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito[indice].cantidad = input.value
    localStorage.setItem("carrito", JSON.stringify(carrito))
    updateShoppingCartTotal()
}

function updateShoppingCartTotal() {
    if (localStorage.getItem("carrito") !== null) {
        listaObjetos = JSON.parse(localStorage.getItem("carrito"))
        let total = 0;
        listaObjetos.forEach(element => {
            total = total + Number(element.precio) * Number(element.cantidad)
            const shoppingCartTotal = document.querySelector(".shoppingCartTotal")
            shoppingCartTotal.textContent = `$${total}`
        })
    }
}

function removeShoppingCartItem(indice) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito.splice(indice, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    if (carrito.length != 0) {
        printShoppingCart()
    } else {
        vaciarCarrito()
        shoppingCart.classList.add("d-none")
    }
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
}

function comprarButtonClicked() {
    vaciarCarrito()
    shoppingCart.classList.add("d-none")

    Swal.fire(
        'Gracias por tu compra!!',
        'En pocos minutos recibiras noticias nuestras!',
        'success',

    )
}

/**************************************************************
*        LOGICA
***************************************************************/

getTarjetas();//obtiene la info de las tajetas y las imprime en el html
printCarrito();//se fija si hay algo en el carrito (localstorage) si hay lo muestra (llamando a la funcion para imprimir la info correspondiente)


var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

document.querySelector("#comprarButton").addEventListener("click", comprarButtonClicked)

/*
*/

/* const addToCartButtons = document.querySelectorAll(".addToCart")
addToCartButtons.forEach((addToCartButton) => {
    addToCartButton.addEventListener('click', addToCartClicked)
})*/




//SCRIPT PARA LIGHTBOX
lightbox.option({
    'resizeDuration': 200,
    'showImageNumberLabel': false,
    'wrapAround': true
})

