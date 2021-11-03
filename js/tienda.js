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
const serverURL = '../'   //'https://www.almapatisserie.com.ar/'
const mockImgTiendaPath = 'assets/mock/tienda.json'
const tiendaImgFullPath = 'assets/img/tienda/'
var listaProductosEnCarrito //variable para almacenar los productos que hay en el carito
var listaProductosDeJson //variable para almacenar el array con todos los objetos del JSON

/**************************************************************
*        FUNCIONES
***************************************************************/

function getTarjetas() { //TRAE EL JSON CON LA INFO DE LAS TARJETAS Y LLAMA A LA FUNCION QUE LAS IMPRIME EN EL HTML

    //fetch(`${serverURL}${mockImgTiendaPath}`).then((res) => res.json()).then((data) => printTarjetas(data));
    $.getJSON(`${serverURL}${mockImgTiendaPath}`, function (data, estado) {
        if (estado == "success") {
            printTarjetas(data)
        } else {
            alert("No se puedo acceder a la informacion")
            window.location.href = "https://wwww.almapatisserie.com.ar"
        }

    })
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
        $(".tarjetasTienda").append(itemsContainer)

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
            carrito[index].cantidad = Number(carrito[index].cantidad) + 1
        } else {
            carrito.push(producto)
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
    } else {
        carrito.push(producto)
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    //swwet alert start
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
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
    printCarrito()
}


function printCarrito() { //
    if (localStorage.getItem("carrito") !== null) {
        //$(".shopping-cart").removeClass("d-none")
        $(".shopping-cart").slideDown(1000)
        printShoppingCart() //funcion para imprimir lo que hay en el carrito
    } else {
        $(".shopping-cart").slideUp(1)
    }
}

function printShoppingCart() { //imprime lo que hay en el local storage dentro del carrito
    listaObjetos = JSON.parse(localStorage.getItem("carrito"))
    $(".shoppingCartItemsContainer").html("")

    let indice = 0
    listaObjetos.forEach(element => {

        const shoppingCartRow = document.createElement("div")
        shoppingCartRow.classList.add("row")

        const divImgTitulo = document.createElement("div")
        divImgTitulo.classList.add("col-6")

        const divImgTitulo2 = document.createElement("div")
        divImgTitulo2.classList.add("d-flex", "align-items-center", "h-100", "border-bottom", "pb-2", "pt-3")

        const img = document.createElement("img")
        img.classList.add("shopping-cart-image")
        img.setAttribute("src", `${serverURL}${tiendaImgFullPath}${element.imagen}`)
        img.setAttribute("alt", `${element.alt}`)

        const titulo = document.createElement("h6")
        titulo.classList.add("text-truncate", "ml-3", "mb-0")
        titulo.textContent = `${element.titulo}`

        const divPrecioContainer = document.createElement("div")
        divPrecioContainer.classList.add("col-2")

        const divPrecio = document.createElement("div")
        divPrecio.classList.add("d-flex", "align-items-center", "h-100", "border-bottom", "pb-2", "pt-3")

        const pPrecio = document.createElement("p")
        pPrecio.classList.add("item-price", "mb-0")
        pPrecio.textContent = `$${element.precio}`

        const divCantidadContainer = document.createElement("div")
        divCantidadContainer.classList.add("col-4")

        const divCantidad = document.createElement("div")
        divCantidad.classList.add("d-flex", "justify-content-between", "align-items-center", "h-100", "border-bottom", "pb-2", "pt-3")

        const cantidadInput = document.createElement("input")
        cantidadInput.classList.add("shopping-cart-quantity-input")
        cantidadInput.setAttribute("type", "number")
        cantidadInput.setAttribute("value", `${element.cantidad}`)
        cantidadInput.setAttribute("onChange", `cambiarCantidadInput(${indice})`)

        const botonBorrar = document.createElement("button")
        botonBorrar.classList.add("btn", "btn-danger")
        botonBorrar.setAttribute("type", "button")
        botonBorrar.setAttribute("onClick", `removeShoppingCartItem(${indice})`)
        botonBorrar.textContent = "X"

        divImgTitulo2.appendChild(img)
        divImgTitulo2.appendChild(titulo)
        divImgTitulo.appendChild(divImgTitulo2)

        divPrecio.appendChild(pPrecio)
        divPrecioContainer.appendChild(divPrecio)

        divCantidad.appendChild(cantidadInput)
        divCantidad.appendChild(botonBorrar)
        divCantidadContainer.appendChild(divCantidad)

        shoppingCartRow.appendChild(divImgTitulo)
        shoppingCartRow.appendChild(divPrecioContainer)
        shoppingCartRow.appendChild(divCantidadContainer)

        $(".shoppingCartItemsContainer").append(shoppingCartRow)

        updateShoppingCartTotal()
        indice++
    });
}

function cambiarCantidadInput(indice) {
    let input = document.querySelectorAll(".shopping-cart-quantity-input")
    if (input[indice].value <= 0) {
        alert("para eliminar un item presione la X")
        input[indice].value = 1
    }
    carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito[indice].cantidad = input[indice].value
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
        //$(".shopping-cart").addClass("d-none")
        $(".shopping-cart").slideUp(1000)
        //shoppingCart.classList.add("d-none")
    }
}

function comprarButtonClicked() {
    //shoppingCart.classList.add("d-none")
    Swal.fire(
        'Gracias por tu compra!!',
        'En pocos minutos recibiras noticias nuestras!',
        'success',

    )
    //$(".shopping-cart").addClass("d-none")
    $(".shopping-cart").slideUp(1000)
    vaciarCarrito()
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
}
/**************************************************************
*        LOGICA
***************************************************************/

getTarjetas();//obtiene la info de las tajetas y las imprime en el html
printCarrito();//se fija si hay algo en el carrito (localstorage) si hay lo muestra (llamando a la funcion para imprimir la info correspondiente)


$("#comprarButton").click(() => {
    comprarButtonClicked()
})
//Esto es lo mismo pero sin Jquery
//document.querySelector("#comprarButton").addEventListener("click", comprarButtonClicked)

$("#mostrarCarrito").click((e) => {
    $(e.target).parent().slideUp(1000)
        .delay(100)
        .slideDown(1000)
})

$("#actualizaTarjetas").click((e) => {
    $("main").fadeOut(1000)
        .delay(100)
        .fadeIn(1000)
})


//SCRIPT PARA LIGHTBOX
lightbox.option({
    'resizeDuration': 200,
    'showImageNumberLabel': false,
    'wrapAround': true
})

