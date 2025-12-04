let mensaje = sessionStorage.getItem("Mensaje")

if (localStorage.getItem("Usuario Activo")){
    let usuario = (JSON.parse(localStorage.getItem("Usuario Activo"))).nombre
    let lugarSesion = document.getElementById("barraSuperior")
    let sesion = document.createElement("a")
    sesion.setAttribute("href", "./opcionesUsuario.html")
    sesion.setAttribute("id","sesionActual")
    sesion.innerText = usuario.toUpperCase()
    lugarSesion.insertBefore(sesion, document.getElementById("inicio"))
    lugarSesion.removeChild(document.getElementById("sesionActual"))
}

if (mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        position: "center",
        stopOnFocus: false,
        style: {
            color: "#000",
            background: "#dd7d65",
        }
    }).showToast();
    sessionStorage.removeItem("Mensaje")
}

notificarCarritoVacio = (mensaje = "El carrito está vacío") => {
    Toastify({
        text: mensaje,
        duration: 2000,
        stopOnFocus: false,
        gravity: "top",
        position: "center",
        style: {
            color: "#000",
            background: "#93AC98",
        }
    }).showToast();
}

document.getElementById("comprarCarrito").onclick = () => {
    if ((JSON.parse(localStorage.getItem("carrito"))).length) {
        location.href="./checkOut.html"
    }else{
        notificarCarritoVacio("No se puede comprar un carrito vacío")
    }
}

document.getElementById("borrarCarrito").onclick = () => {
    if ((JSON.parse(localStorage.getItem("carrito"))).length) {
        Swal.fire({
            title: "¿Borrar carrito?",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "Borrar",
            denyButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            denyButtonColor: "#3085d6",
            reverseButtons: true,
            })
        .then((respuesta) => {
            if (respuesta.isConfirmed) {
                localStorage.setItem("carrito", "[]")
                listadoDeProductos("")
            }
        })
    }else{
        notificarCarritoVacio("El carrito ya está vacío")
    }
}

agregarOtraCaja = (id) => {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito.push(id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    cargarCarritoGuardado()
}

quitarUnaCaja = (id) => {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito.splice(carrito.indexOf(id), 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    cargarCarritoGuardado()
}

quitarTodasCajas = (id) => {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    do {
        carrito.splice(carrito.indexOf(id), 1)
    }while (carrito.includes(id))
    localStorage.setItem("carrito", JSON.stringify(carrito))
    cargarCarritoGuardado()
}

activarBotones = () => {
    let botones = ""
    botones = document.getElementsByClassName("agregarOtraCaja")
    for (let boton of botones) {
        boton.onclick = (bot) => {
            agregarOtraCaja(bot.currentTarget.id)
        }
    }
    botones = document.getElementsByClassName("quitarUnaCaja")
    for (let boton of botones) {
        boton.onclick = (bot) => {
            quitarUnaCaja(bot.currentTarget.id)
        }
    }
    botones = document.getElementsByClassName("quitarTodas")
    for (let boton of botones) {
        boton.onclick = (bot) => {
            quitarTodasCajas(bot.currentTarget.id)
        }
    }
}

async function cargarCarritoGuardado() {
    try {
        listadoDeProductos(await recuperarProductosDelCarrito(true))
    } catch(err) {
        console.error("Se produjo un error durante la carga de datos desde el servidor: ", err)
        const mensajeError = document.getElementById("cuerpo")
        mensajeError.removeAttribute("class")
        mensajeError.innerHTML = `<h2 class="vacio">Se produjo un error al conectar con el servidor.<br>Vuelva a intentarlo mas tarde.</h2>`
    }
}
cargarCarritoGuardado()

function listadoDeProductos(datosARenderizar) {
    let cantidadDeProductos = document.getElementById("numeroDeProductos")
    let precioTotal = document.getElementById("precioTotal")
    let precioTotalCalculado = 0
    let productos = document.getElementById("productosCarrito")
    productos.innerHTML = "";
    if (datosARenderizar.length != 0) {
        datosARenderizar.forEach(producto => {
            precioTotalCalculado = (Math.round((producto.precio * producto.duplicado + precioTotalCalculado)* 10)/10)
            let render = document.createElement("div")
            render.setAttribute("class", "productos")
            render.innerHTML = `<h3>${producto.titulo}</h3>
                                <div class="descripcionProducto">
                                    <p><span class="negrita">${producto.duplicado}</span> caja/s de <span class="negrita">${producto.cantidad}</span> unidades c/u para un total de <span class="negrita">${producto.cantidad * producto.precio}</span> unidades.  Precio por caja: <span class="negrita">$${producto.precio}</span></p>
                                    <p class="precioCarrito">subtotal: $${Math.round(producto.precio * producto.duplicado * 10)/10}</p>
                                </div>
                                <button class="agregarOtraCaja" id="${producto.id}">Agrgar otra caja</button>
                                <button class="quitarUnaCaja" id="${producto.id}">Quitar una caja</button>
                                <button class="quitarTodas" id="${producto.id}">Quitar todo</button>`
            productos.appendChild(render)
        })
        precioTotal.innerText = `Total: $${precioTotalCalculado}`
        cantidadDeProductos.innerText = (JSON.parse(localStorage.getItem("carrito")).length + " Productos")
        activarBotones()
    }else{
        precioTotal.innerText = "Total: $0"
        cantidadDeProductos.innerText = "No hay productos"
        productos.innerHTML = `<h2 class="vacio centrar"> El Carrito está vacío.</h2>`
    }
}