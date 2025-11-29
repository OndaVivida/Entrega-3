if (!localStorage.getItem("Usuario Activo")) {
    location.href="./iniciarSesion.html"
}

const usuarioActivo = (JSON.parse(localStorage.getItem("Usuario Activo"))).id
const baseDeDatosDeUsuarios = JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))
let usuarioActivoCompleto = baseDeDatosDeUsuarios.find(usuario => usuario.id == usuarioActivo)

let mensaje = sessionStorage.getItem("Mensaje")
if (mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        className: "notificacion",
    }).showToast();
    sessionStorage.removeItem("Mensaje")
}

// Editar informacion
editarGuardarDatos = (dato, direccion) => {
    direccion = direccion.split(".")
    if (direccion[1]) {
        usuarioActivoCompleto[direccion[0]][direccion[1]] = dato
        if (direccion[1] == "nombres") {
            let usuarioActivoModificar = JSON.parse(localStorage.getItem("Usuario Activo"))
            usuarioActivoModificar.nombre = dato.indexOf(" ") == -1 ? dato : dato.slice(0, dato.indexOf(" ")),
            localStorage.setItem("Usuario Activo", JSON.stringify(usuarioActivoModificar))
        }
    } else {
        usuarioActivoCompleto[direccion[0]] = dato
    }
    localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(baseDeDatosDeUsuarios))
    renderDePagina()
}
// Correo, Nombre y Contraseña no se pueden borrar.
editarBorrarDatos = (direccion) => {
    direccion = direccion.split(".")
    usuarioActivoCompleto[direccion[0]][direccion[1]] = undefined
    localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(baseDeDatosDeUsuarios))
    renderDePagina()
}

// Notificaciones
confirmacionesDeEdicion = (titulo, placeholder, mensajeInvalido, direccionAEditar, botonBorrar) => {
    Swal.fire({
        title: titulo,
        input: "text",
        inputPlaceholder: placeholder,
        showDenyButton: botonBorrar,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "Borrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#013601",
        denyButtonColor: "#700101",
        inputValidator: (nombresIngresados) => {
            if (nombresIngresados == "") {
                return mensajeInvalido
            }
        }
    }).then((respuesta) => {
        if (respuesta.isConfirmed) {
            editarGuardarDatos(respuesta.value, direccionAEditar)
        } else if (respuesta.isDenied) {
            editarBorrarDatos(direccionAEditar)
        }
    })
}

// Nombres
document.getElementById("editarNombres").onclick = () => {
    const nombres = document.getElementById("nombres").innerText
    confirmacionesDeEdicion("Cambiar Nombres", nombres, "Ingrese mínimo UN nombre", "nombre.nombres", false)
}
// Apellidos
document.getElementById("editarApellidos").onclick = () => {
    const apellidos = document.getElementById("apellidos").innerText
    confirmacionesDeEdicion("Cambiar Apellidos", apellidos, 'Ingrese mínimo UN apellido, si desea borrarlo presione "Borrar"', "nombre.apellidos", true)
}
// Localidad
document.getElementById("editarLocalidad").onclick = () => {
    const localidad = document.getElementById("localidad").innerText
    confirmacionesDeEdicion("Editar Localidad", localidad, 'Ingrese una Localidad, si desea borrarla presione "Borrar"', "direccion.localidad", true)
}
// Código postal
document.getElementById("editarCodigoPostal").onclick = () => {
    const codigoPostal = document.getElementById("codigoPostal").innerText
    confirmacionesDeEdicion("Editar Código Postal", codigoPostal, 'Ingrese un Código Postal, si desea borrarlo presione "Borrar"', "direccion.codigoPostal", true)
}
// Calle
document.getElementById("editarCalle").onclick = () => {
    const calle = document.getElementById("calle").innerText
    confirmacionesDeEdicion("Editar Calle", calle, 'Ingrese una Calle, si desea borrarla presione "Borrar"', "direccion.calle", true)
}
// Correo
document.getElementById("editarCorreo").onclick = () => {
    const contraseña = document.getElementById("contraseña").innerText
    Swal.fire({
        title: "Cambiar Correo",
        html: `<h3>Ten en cuenta que al cambiar el correo</h3> 
            <h3><span class="negrita">EL NUEVO CORREO</span>, pasará a ser la forma de login</h3>`,
        input: "email",
        icon: "warning",
        inputPlaceholder: "Ingrese el nuevo correo",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#013601",
        inputValidator: (correoIngresado) => {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoIngresado)) { //En stackoverflow hay un choclo gigantesco de caracteres, creo que esto debería de ser suficiente. no entiendo claramente que es cada cosa
                if (baseDeDatosDeUsuarios.find(usuario => usuario.correo == correoIngresado)) {
                    return "El nuevo Correo ya está en uso"
                }
            } else {
                return "Ingrese un Correo válido"
            }
        }
    }).then((correoIngresado) => {
        if (correoIngresado.isConfirmed) {
            Swal.fire({
                html: `<h2>Cambiar Correo a:</h2> 
                    <h2><span class="negrita">${correoIngresado.value}</span></h2>
                    <p>Para confirmar ingrese su contraseña</p>`,
                input: "password",
                inputPlaceholder: contraseña,
                showCancelButton: true,
                confirmButtonText: "Cambiar Correo",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#013601",
                inputValidator: (contraseñaIngresada) => {
                    if (contraseñaIngresada === usuarioActivoCompleto.contraseña) {
                        editarGuardarDatos(correoIngresado.value, "correo")
                    } else {
                        return "Contraseña incorrecta"
}}})}})} // <-- es muy raro verlo así pero lo compacté para que no quede muy largo

// Contraseña
document.getElementById("editarContraseña").onclick = () => {
    const contraseña = document.getElementById("contraseña").innerText
    Swal.fire({
        title: "Cambiar Contraseña",
        text: "Para continuar ingrese su contraseña actual",
        input: "password",
        inputPlaceholder: contraseña,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#013601",
        inputValidator: (contraseñaActual) => {
            if (contraseñaActual !== usuarioActivoCompleto.contraseña) {
                return "Contraseña incorrecta"
            }
        }
    }).then((contraseñaActual) => {
        if (contraseñaActual.isConfirmed) {
            Swal.fire({
                title: "Cambiar Contraseña",
                html:`<h3>Ingrese su nueva contraseña</h3>
                    <input type="password" id="contraseñaCambiada" class="swal2-input">
                    <h3>Repita la contraseña</h3>
                    <input type="password" id="contraseñaCambiadaRepetida" class="swal2-input" >`,
                showCancelButton: true,
                confirmButtonText: "Cambiar Contraseña",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#013601",
                preConfirm: () => {
                    if (document.getElementById("contraseñaCambiada").value == document.getElementById("contraseñaCambiadaRepetida").value) {
                        return document.getElementById("contraseñaCambiada").value
                    } else {
                        Swal.showValidationMessage("Las Contraseñas NO coinciden")
                    }
                }
            }).then((contraseñaNueva) => {
                if (contraseñaNueva.isConfirmed) {
                    editarGuardarDatos(contraseñaNueva.value, "contraseña")
}})}})}
// Número
editarNumero = () => {
    let numeroCalle = document.getElementById("numeroCalle").innerText
    let numeroDepartamento
    if (numeroCalle == "Sin Asignar") {
        numeroCalle = ""
    }
    try {
        numeroDepartamento = document.getElementById("numeroDepartamento").innerText
    } catch {
        numeroDepartamento = ""
    }
    Swal.fire({
        title: "Cambiar Número y/o Departamento",
        html:`<h3>Ingrese el número de la casa</h3>
            <input type="text" id="numeroCalleCambiado" class="swal2-input" value="${numeroCalle}" placeholder="Sin Asignar">
            <h3>Ingrese el número de departamento</h3>
            <input type="text" id="numeroDepartamentoCambiado" class="swal2-input" value="${numeroDepartamento}" placeholder="Ninguno">
            <p>Para borrar déjelo en blanco</p>`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#013601",
        preConfirm: () => {
            const numeroDepartamentoCambiado = document.getElementById("numeroDepartamentoCambiado").value
            const numeroCalleCambiado = document.getElementById("numeroCalleCambiado").value
            return [numeroCalleCambiado, numeroDepartamentoCambiado]
        }
    }).then((numeros) => {
        if (numeros.isConfirmed) {
            switch (true) {
                case numeros.value[0] == "":
                    usuarioActivoCompleto.direccion.tipoDepartamento = false
                    editarBorrarDatos("direccion.numeroDepartamento")
                    editarBorrarDatos("direccion.alturaCalle")
                    break
                case numeros.value[1] == "":
                    usuarioActivoCompleto.direccion.tipoDepartamento = false
                    editarBorrarDatos("direccion.numeroDepartamento")
                    editarGuardarDatos(numeros.value[0], "direccion.alturaCalle")
                    break
                case numeros.value[1] != "":
                    usuarioActivoCompleto.direccion.tipoDepartamento = true
                    editarGuardarDatos(numeros.value[0], "direccion.alturaCalle")
                    editarGuardarDatos(numeros.value[1], "direccion.numeroDepartamento")
                    break
                default:
                    console.error("ERROR EN SWITCH ", numeros.value)
            }
        }
    })
}
activarBotonEditarCalle = () => document.getElementById("editarNumero").onclick = () => editarNumero()

// Funcion eliminar cuenta, duh
eliminarCuenta = () => {
    sessionStorage.setItem("Mensaje", "Se ha eliminado la cuenta")
    localStorage.removeItem("Usuario Activo")
    const baseDeDatosDeUsuariosModificada = baseDeDatosDeUsuarios.filter(usuario => usuario.id != usuarioActivoCompleto.id)
    localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(baseDeDatosDeUsuariosModificada))
    location.href="../index.html"
}

// Botón de borrar cuenta
document.getElementById("eliminarCuenta").onclick = () => {
    Swal.fire({
        title: "¿Borrar cuenta?",
        text: "¿Está seguro que quiere BORRAR la cuenta? Esta acción es irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        reverseButtons: true,
        })
    .then((respuesta) => {
        if (respuesta.isConfirmed) {
            Swal.fire({
                title: "Borrar cuenta",
                text: "Para borrar la cuenta ingrese su contraseña",
                input: "text",
                showCancelButton: true,
                confirmButtonText: "BORRAR CUENTA",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d33",
                reverseButtons: true,
                inputValidator: (contraseñaIngresada) => {
                    if (contraseñaIngresada === usuarioActivoCompleto.contraseña) {
                        eliminarCuenta()
                    } else {
                        return "Contraseña incorrecta"
}}})}})}

// Botón cerrar sesion
document.getElementById("cerrarSesion").onclick = () => {
    localStorage.removeItem("Usuario Activo")
    sessionStorage.setItem("Mensaje", "Sesion Cerrada")
    location.href="./iniciarSesion.html"
}

// Renderizador de datos
function renderDePagina() {
    document.getElementById("nombres").innerText = usuarioActivoCompleto.nombre.nombres || "Sin Asignar"
    document.getElementById("apellidos").innerText = usuarioActivoCompleto.nombre.apellidos || "Sin Asignar"
    document.getElementById("correo").innerText = usuarioActivoCompleto.correo || "Sin Asignar"
    document.getElementById("localidad").innerText = usuarioActivoCompleto.direccion.localidad || "Sin Asignar"
    document.getElementById("codigoPostal").innerText = usuarioActivoCompleto.direccion.codigoPostal || "Sin Asignar"
    document.getElementById("calle").innerText = usuarioActivoCompleto.direccion.calle || "Sin Asignar"
    const tipoDepto = document.getElementById("departamento")
    if (usuarioActivoCompleto.direccion.tipoDepartamento) {
        tipoDepto.innerHTML = `
        <h3>Número: <span id="numeroCalle">${usuarioActivoCompleto.direccion.alturaCalle || "Sin Asignar"}</span>  Departamento: <span id="numeroDepartamento">${usuarioActivoCompleto.direccion.numeroDepartamento || "Sin Asignar"}</span></h3>
        <button class="editar" id="editarNumero">Editar</button>`
    } else {
        tipoDepto.innerHTML = `
        <h3>Número: <span id="numeroCalle">${usuarioActivoCompleto.direccion.alturaCalle || "Sin Asignar"}</span></h3>
        <button class="editar" id="editarNumero">Editar</button>`
    }
    let censurarContraseña = "*"
    for (let i = 1; i < String(usuarioActivoCompleto.contraseña).length; i++) {
        censurarContraseña += "*"
    }
    document.getElementById("contraseña").innerText = censurarContraseña
    activarBotonEditarCalle()
}
renderDePagina()