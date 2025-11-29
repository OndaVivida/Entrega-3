localStorage.setItem("carrito", localStorage.getItem("carrito") || JSON.stringify([]))
let mensaje = sessionStorage.getItem("Mensaje")
let baseDeDatos = []
let errorServidor = false

if (mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
            color: "#013601",
            background: "#93AC98",
        }
    }).showToast();
    sessionStorage.removeItem("Mensaje")
}

async function cargarContenido() {
    const URL = "./db/BaseDeDatosProductos.json"
    return fetch (URL)
        .then(response => response.json())
        .then(data => baseDeDatos = data)
        .then(() => filtrarBaseDeDatos())
    .catch((err)=> {
        console.error("Se produjo un error durante la carga de datos del servidor: ", err)
        document.getElementById("productos").innerHTML = `<h2 class="vacio">No se ha podido establecer la conexión con el servidor, vuelva a intentarlo mas tarde.</h2>` 
        return true
    })
}
cargarContenido().then(respuesta => errorServidor = respuesta)

if (localStorage.getItem("Usuario Activo")) {
    let usuario = (JSON.parse(localStorage.getItem("Usuario Activo"))).nombre
    let lugarSesion = document.getElementById("barraSuperior")

    let sesion = document.createElement("a")
    sesion.setAttribute("href", "./pages/opcionesUsuario.html")
    sesion.setAttribute("id","sesionActual")
    sesion.innerText = usuario.toUpperCase()
    lugarSesion.insertBefore(sesion, document.getElementById("botonCompra"))
    lugarSesion.removeChild(document.getElementById("sesionActual"))
}

filtrarBaseDeDatos = () => {
    if (errorServidor) {
        return
    }
    
    let baseDeDatosEditada = baseDeDatos
    switch (ordenarLista.value) {
        case "ordenarPorMayorPrecio":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => b.precio - a.precio)
            break
        case "ordenarPorMenorPrecio":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => a.precio - b.precio)
            break
        case "ordenarPorMayorCantidad":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => b.cantidad - a.cantidad)
            break
        case "ordenarPorMenorCantidad":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => a.cantidad - b.cantidad)
            break
        case "ordenarPorTipoAZ":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => a.tipo.localeCompare(b.tipo))
            break
        case "ordenarPorTipoZA":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => b.tipo.localeCompare(a.tipo))
            break
        case "":
            baseDeDatosEditada = baseDeDatosEditada.sort((a, b) => a.id - b.id)
            break
    }
    sessionStorage.setItem("orden", ordenarLista.value)

    if (filtroListaPrecio.value != "" && filtroListaPrecio.value != 0){
        baseDeDatosEditada = baseDeDatosEditada.filter(elemento => elemento.precio <= filtroListaPrecio.value)
        sessionStorage.setItem("filtroPrecio", filtroListaPrecio.value)
    }else{
        sessionStorage.setItem("filtroPrecio", "")
    }

    if (filtroListaTipo.value != "") {        
        baseDeDatosEditada = baseDeDatosEditada.filter(elemento => elemento.tipo.replace("ó", "o") == filtroListaTipo.value)
        sessionStorage.setItem("filtroTipo", filtroListaTipo.value)
    }

    listadoDeProductos(baseDeDatosEditada)
}

actualizarIcono = () => {
    let carritoIcono = document.getElementById("botonCompra")
    carritoIcono.innerText = `Carrito ${JSON.parse(localStorage.getItem("carrito")).length || ""}`
}
actualizarIcono()

activarCarrito = () => {
    let botones = document.getElementsByClassName("botonCompra")
    for (let boton of botones) {
        boton.onclick = (bot) => {
            agregarAlCarrito(bot.currentTarget.id)
        }
    }
}

agregarAlCarrito = (id) =>{
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    carrito.push(id)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarIcono()
}

let ordenarLista = document.getElementById("ordenarLista")
ordenarLista.value = (sessionStorage.getItem("orden") ?? "")
ordenarLista.onchange = () => filtrarBaseDeDatos()

let filtroListaPrecio = document.getElementById("filtroListaPrecio")
filtroListaPrecio.value = sessionStorage.getItem("filtroPrecio")
filtroListaPrecio.onchange = () => filtrarBaseDeDatos()

let filtroListaTipo = document.getElementById("filtroListaTipo")
filtroListaTipo.value = (sessionStorage.getItem("filtroTipo") ?? "")
filtroListaTipo.onchange = () => filtrarBaseDeDatos()

// Renderizador de la página
function listadoDeProductos(datosARenderizar) {
    let productos = document.getElementById("productos")
    productos.innerHTML = ""
    if (datosARenderizar.length != 0) {
        datosARenderizar.forEach(producto => {
            let render = document.createElement("div")
            render.setAttribute("class", "producto")
            render.innerHTML = `<h3>${producto.titulo}</h3>
                                <p>${producto.descripcion}</p>
                                <p>Caja de <span class="negrita">${producto.cantidad}</span> unidades para <span class="negrita">${producto.tipo}</span>.<span class="precio">$${producto.precio}</span></p>
                                <button class="botonCompra" id="${producto.id}">Añadir al Carrito</button>`
            productos.appendChild(render)
        })
        activarCarrito()
        actualizarIcono()
    }else{
        let render = document.createElement("h2")
        render.setAttribute("class", "vacio")
        render.innerText = "En este momento no tenemos productos que coincidan con sus filtros de búsqueda."
        productos.appendChild(render)
    }
}