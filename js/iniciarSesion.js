const dbUsuarios = JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))

let mensaje = sessionStorage.getItem("Mensaje")
if (mensaje) {
    Toastify({
        text: mensaje,
        position: "center",
        stopOnFocus: false,
        style: {
            color: "#0F2714",
            background: "#F7B05B",
        }
    }).showToast();
    sessionStorage.removeItem("Mensaje")
}

if (localStorage.getItem("Usuario Activo")){
    location.href="./opcionesUsuario.html"
}

document.getElementById("formularioIniciarSesion").onsubmit = (desactivarFormulario) => {
    desactivarFormulario.preventDefault();
    let correoIngresado = document.getElementById("correoIngresado").value
    let contraseñaIngresada = document.getElementById("contraseñaIngresada").value
    let pruebaInicioSesion = dbUsuarios.find(usuarios => usuarios.correo == correoIngresado)
    try {
        if (pruebaInicioSesion.contraseña == contraseñaIngresada){
            let usuarioActivo = {
                // Si tiene 2 nombres muestra sólo el primero
                nombre: pruebaInicioSesion.nombre.nombres.indexOf(" ") == -1 ? pruebaInicioSesion.nombre.nombres : pruebaInicioSesion.nombre.nombres.slice(0, pruebaInicioSesion.nombre.nombres.indexOf(" ")),
                id: pruebaInicioSesion.id,
            }
            localStorage.setItem("Usuario Activo", JSON.stringify(usuarioActivo))
            sessionStorage.setItem("Mensaje", "Se ha iniciado sesión correctamente")
            location.href="../index.html"
        }else{
            throw new Error("")
        }
    } catch (err) {
        Toastify({
            text: "Correo o Contraseña Erroneos",
            duration: 2000,
            position: "center",
            stopOnFocus: false,
            style: {
                color: "#c20606ff",
                background: "#93AC98",
            }
        }).showToast();
    }
}
//Parte que sería eliminada
//Botón de pre-creado
document.getElementById("cargarUsuarioDefectoCreado").onclick = () => {
    document.getElementById("correoIngresado").value = "PreCarga@yahoo.com"
    document.getElementById("contraseñaIngresada").value = "369963"
}
//Botones de pre-carga
document.getElementById("cargarUsuarioDefecto1").onclick = () => {
    document.getElementById("correoIngresado").value = "admin@lodecarloh.com"
    document.getElementById("contraseñaIngresada").value = "admin"
}
document.getElementById("cargarUsuarioDefecto2").onclick = () => {
    document.getElementById("correoIngresado").value = "carloh@lodecarloh.com"
    document.getElementById("contraseñaIngresada").value = "admin"
}
document.getElementById("cargarUsuarioDefecto3").onclick = () => {
    document.getElementById("correoIngresado").value = "genesis@skynet.com"
    document.getElementById("contraseñaIngresada").value = "123456789"
}
document.getElementById("cargarUsuarioDefecto4").onclick = () => {
    document.getElementById("correoIngresado").value = "encanta@que.la"
    document.getElementById("contraseñaIngresada").value = "Contraseña"
}
document.getElementById("cargarUsuarioDefecto5").onclick = () => {
    document.getElementById("correoIngresado").value = "anedison@correo.net"
    document.getElementById("contraseñaIngresada").value = "C0ntr4s3ñ4"
}
document.getElementById("cargarUsuarioDefecto6").onclick = () => {
    document.getElementById("correoIngresado").value = "correoDe@Prueba.com"
    document.getElementById("contraseñaIngresada").value = "defecto"
}