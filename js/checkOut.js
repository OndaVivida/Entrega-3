let ingresadoDepartamento = document.getElementById("ingresadoDepartamento")
let usuarioActivo = JSON.parse(localStorage.getItem("Usuario Activo")) || ""
const formularioDatosDeVenta = document.getElementById("formularioDatosDeVenta")
let informacionIncompleta = false

if (!sessionStorage.getItem("Resumen")) {
    sessionStorage.setItem("Mensaje", "Se ha cancelado la venta")
    location.href="./carrito.html"
}

notificacionesDeCarga = () => {
    Toastify({
        text: "Datos cargados desde el usuario",
        duration: 2000,
        gravity: "top",
        position: "center",
        stopOnFocus: false,
        callback: () => {
            Toastify({
                text: "Los Datos de la Tarjeta NO se guardan",
                duration: 2000,
                position: "center",
                stopOnFocus: false,
                style: {
                    color: "#000",
                    background: "#caae76",
                }
            }).showToast();
        },
        style: {
            color: "#000",
            background: "#caae76",
        }
    }).showToast();
}

// El botón del departamento
ingresadoDepartamento.onclick = () => {
    if (!document.getElementById("textoExiste")) {
        let opcionesDepto = document.createElement("div")
        opcionesDepto.setAttribute("id", "textoExiste")
        opcionesDepto.innerHTML = ` <h3>Número de departamento</h3>
                                    <input type="text" id="ingresadoDepartamentoNumero" required>`
        document.getElementById("esDepartamento").appendChild(opcionesDepto)
        ingresadoDepartamento.innerText = "No, es una Casa"
        ingresadoDepartamento.setAttribute("class", "noDepto")
    }else{
        document.getElementById("textoExiste").remove()
        ingresadoDepartamento.setAttribute("class", "siDepto")
        ingresadoDepartamento.innerText = "Sí, es un Departamento"
    }
}
// Carga de datos de usuario
if (usuarioActivo.id) {
    const dbUsuarioActivo = (JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))).find((usuario) => usuario.id == usuarioActivo.id)
    let comprobadorVacio = []
    comprobadorVacio.push(document.getElementById("ingresadoNombres").value = dbUsuarioActivo.nombre.nombres || "")
    comprobadorVacio.push(document.getElementById("ingresadoApellidos").value = dbUsuarioActivo.nombre.apellidos || "")
    comprobadorVacio.push(document.getElementById("ingresadoEmail").value = dbUsuarioActivo.correo || "")
    comprobadorVacio.push(document.getElementById("ingresadoLocalidad").value = dbUsuarioActivo.direccion.localidad || "")
    comprobadorVacio.push(document.getElementById("ingresadoCodigoPostal").value = dbUsuarioActivo.direccion.codigoPostal || "")
    comprobadorVacio.push(document.getElementById("ingresadoCalle").value = dbUsuarioActivo.direccion.calle || "")
    comprobadorVacio.push(document.getElementById("ingresadoNumero").value = dbUsuarioActivo.direccion.alturaCalle || "")
    if (dbUsuarioActivo.direccion.tipoDepartamento) {
        ingresadoDepartamento.onclick()
        comprobadorVacio.push(document.getElementById("ingresadoDepartamentoNumero").value = dbUsuarioActivo.direccion.numeroDepartamento)
    }
    if (comprobadorVacio.some((objeto) => objeto == "")) {
        Swal.fire({
            title: "Parece ser que los datos están incompletos",
            text: "No te preocupes, los guardaremos automáticamente cuando finalices la compra, excepto la tarjeta",
            icon: "info",
        })
        informacionIncompleta = true
    }else{
        notificacionesDeCarga()
    }
}else{
    Toastify({
        text: "Inicie sesion para pre-cargar los datos, no es obligatorio tener cuenta para comprar",
        duration: 4000,
        position: "center",
        onClick: () => {
            location.href="./iniciarSesion.html"
        },
        style: {
            color: "#000",
            background: "#dd7d65",
        }
    }).showToast();
}
// Si tiene cuenta y espacios vacíos los guarda
guardarInformacion = () => {
    let dbUsuarioActivo = (JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))).find((usuario) => usuario.id == usuarioActivo.id)
    let baseDeDatosDeUsuarios = JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))
    baseDeDatosDeUsuarios = baseDeDatosDeUsuarios.filter(usuario => usuario.id != usuarioActivo.id)

    dbUsuarioActivo.nombre.nombres = document.getElementById("ingresadoNombres").value
    dbUsuarioActivo.nombre.apellidos = document.getElementById("ingresadoApellidos").value
    dbUsuarioActivo.correo = document.getElementById("ingresadoEmail").value
    dbUsuarioActivo.direccion.localidad = document.getElementById("ingresadoLocalidad").value
    dbUsuarioActivo.direccion.codigoPostal = document.getElementById("ingresadoCodigoPostal").value
    dbUsuarioActivo.direccion.calle = document.getElementById("ingresadoCalle").value
    dbUsuarioActivo.direccion.alturaCalle = document.getElementById("ingresadoNumero").value
    if (document.getElementById("ingresadoDepartamento").innerText == "No, es una Casa") {
        dbUsuarioActivo.direccion.tipoDepartamento = true
        dbUsuarioActivo.direccion.numeroDepartamento = document.getElementById("ingresadoDepartamentoNumero").value
    }
    baseDeDatosDeUsuarios.push(dbUsuarioActivo)
    localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(baseDeDatosDeUsuarios))

    Toastify({
        text: "Datos Guardados",
        duration: 4000,
        position: "center",
        style: {
            color: "#013601",
            background: "#93AC98",
        }
    }).showToast();
}

formularioDatosDeVenta.onsubmit = (desactivarFormulario) => {
    desactivarFormulario.preventDefault()
    // NO compruebo la longitud de la tarjeta para no joder tanto al rellenar el formulario
    let vencimiento = document.getElementById("vencimientoTarjeta").value
    const diaActual = new Date()
    const fechaActual = diaActual.getFullYear() + "-" + (diaActual.getMonth() + 1)
    let codigoCVV = document.getElementById("codigoCVV").value
    if (vencimiento < fechaActual) { // Comprobación de vencimiento de la tarjeta
        Swal.fire("La Tarjeta está vencida", "", "error")
    } else if (String(codigoCVV).length != 3) { // Comprobacion de la longitud del CVV
        Swal.fire("El código CVV es erroneo", "", "error")
    } else {
        if (informacionIncompleta) {
            guardarInformacion()
        }
        formularioDatosDeVenta.reset()
        sessionStorage.setItem("Mensaje", "Gracias por su compra")
        Swal.fire({
            title: "Compra realizada",
            background: "#05232c",
            color: "#93AC98",
            confirmButtonColor: "#F7B05B",
            html: `
                En breves le enviaremos un correo con el código de seguimiento del envio
                <p>Gracias por comprar en </p><span class="loDe">Lo de </span><span class="carloh">Carloh</span>
                `,
            icon: "success",
        }).then(() => {
            localStorage.setItem("carrito", "[]")
            location.href="../index.html"
        })
    }
}
//renderizador
function productosCheck(datosARenderizar) {
    let ubicacion = document.getElementById("productosCheck")
    let tope = document.getElementById("totalCheck")
    let precioTotal = 0
    datosARenderizar.forEach(producto => {
        precioTotal = (Math.round((producto.precio * producto.duplicado + precioTotal)* 10)/10)
        let render = document.createElement("div")
        render.setAttribute("class", "productos")
        render.innerHTML = `<h3>${producto.titulo}</h3>
                            <p class="productosLinea"><span class="negrita">${producto.duplicado}</span> caja/s x <span class="negrita">$${producto.precio}</span> c/u <span class="subtotal">subtotal: $${Math.round(producto.precio * producto.duplicado * 10)/10}</span></p>`
        ubicacion.insertBefore(render, tope)
    })
    document.getElementById("totalCheck").innerText = `TOTAL: $${precioTotal}`
}
productosCheck(JSON.parse(sessionStorage.getItem("Resumen")))
sessionStorage.removeItem("Resumen")