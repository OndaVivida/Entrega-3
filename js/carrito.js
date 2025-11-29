let mensaje = sessionStorage.getItem("Mensaje")
let datosProcesadosSimplificados = []
let baseDeDatos

cargarContenido = () => {
    const URL = "../db/BaseDeDatosProductos.json"
    fetch (URL)
        .then(response => response.json())
        .then(data => baseDeDatos = data)
        .then(() => cargarCarritoGuardado((JSON.parse(localStorage.getItem("carrito")) ?? [])))
    .catch((err)=> {
        console.error("Se produjo un error durante la carga de datos desde el servidor: ", err)
        let productos = document.getElementById("productosCarrito")
        productos.innerHTML = ""
        let render = document.createElement("h2")
        render.setAttribute("class", "vacio")
        render.innerText = "En estos momentos estamos teniendo problemas técnicos en el servidor, vuelva a intentarlo mas tarde."
        productos.appendChild(render)
    })
}
cargarContenido()

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
        sessionStorage.setItem("Resumen", JSON.stringify(datosProcesadosSimplificados))
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
    cargarCarritoGuardado(carrito)
}

quitarUnaCaja = (id) => {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito.splice(carrito.indexOf(id), 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    cargarCarritoGuardado(carrito)
}

quitarTodasCajas = (id) => {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    do {
        carrito.splice(carrito.indexOf(id), 1)
    }while (carrito.includes(id))
    localStorage.setItem("carrito", JSON.stringify(carrito))
    cargarCarritoGuardado(carrito)
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

class DatosRepetidos {
    constructor(id, repeticiones){
        this.id = id
        this.repeticiones = repeticiones
    }
}

function cargarCarritoGuardado(carrito) {
    let datosPreProcesados = []
    let datosProcesados = []
    let repeticiones = 0
    let datoActual = 0
    carrito = carrito.sort((a, b) => a - b)
    while (carrito.length) {
        do {
            repeticiones++
            datoActual = carrito.shift()
        }while (datoActual == carrito[0])

        datosPreProcesados.push(new DatosRepetidos(datoActual, repeticiones))
        repeticiones = 0
    }
    datosPreProcesados.forEach(dato => {
        let datosEnProcesamiento = baseDeDatos.find(i => i.id == dato.id)
        datosEnProcesamiento.duplicado = dato.repeticiones
        datosProcesados.push(datosEnProcesamiento)
    })
    datosProcesadosSimplificados = datosProcesados.map(dato => ({
        titulo: dato.titulo,
        precio: dato.precio,
        duplicado: dato.duplicado,
    }))
    listadoDeProductos(datosProcesados)
}

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
        productos.innerHTML = `<h2 class="vacio"> El Carrito está vacío.</h2>`
    }
}