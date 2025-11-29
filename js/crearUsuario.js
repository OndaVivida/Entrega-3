let dbUsuarios = JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))

if (localStorage.getItem("Usuario Activo")){
    sessionStorage.setItem("Mensaje", "Ya tiene una sesion activa")
    location.href="../index.html"
}

let mensaje = sessionStorage.getItem("Mensaje")
if (mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
    }).showToast();
    sessionStorage.removeItem("Mensaje")
}

document.getElementById("formularioCrearCuenta").onsubmit = (desactivarFormulario) => {
    desactivarFormulario.preventDefault();
    let ingresoUsuario = document.getElementById("crearUsuario").value
    let ingresoMail = document.getElementById("crearEmail").value
    let ingresoContraseña = document.getElementById("crearContraseña").value
    let ingresoContraseñaRepetida = document.getElementById("crearContraseñaRepetida").value

    switch (true) {
        case dbUsuarios.some(ususarios => ususarios.correo == ingresoMail):
            Swal.fire("El Correo ya está en uso", "", "error")
            break
        case ingresoContraseña != ingresoContraseñaRepetida:
            Swal.fire("Las Contraseñas no coinciden", "", "error")
            break
        case ingresoContraseña.includes(" "):
            Swal.fire("Las Contraseña NO puede tener espacios", "", "error")
            break
        default:
            let usuarioCreado = new CreadorUsuarios(ingresoUsuario, ingresoMail, ingresoContraseña)
            dbUsuarios.push(usuarioCreado)
            let usuarioActual = {
                nombre: usuarioCreado.nombre.nombres.indexOf(" ") == -1 ? usuarioCreado.nombre.nombres : usuarioCreado.nombre.nombres.slice(0, usuarioCreado.nombre.nombres.indexOf(" ")),
                id: usuarioCreado.id,
            }
            localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(dbUsuarios))
            localStorage.setItem("Usuario Activo", JSON.stringify(usuarioActual))
            sessionStorage.setItem("Mensaje", "Cuenta creada correctamente, se ha iniciado sesion de forma automática")
            location.href="../index.html"
        break
    }
}
//Parte que sería eliminada
//Botón de pre-crear
document.getElementById("crearUsuarioDefecto").onclick = () => {
    document.getElementById("crearUsuario").value = "María Jesús"
    document.getElementById("crearEmail").value = "PreCarga@yahoo.com"
    document.getElementById("crearContraseña").value = "369963"
    document.getElementById("crearContraseñaRepetida").value = "369963"
}