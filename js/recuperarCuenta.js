let mensaje = sessionStorage.getItem("Mensaje")
const baseDeDatosDeUsuarios = JSON.parse(localStorage.getItem("Base de Datos de Usuarios Insegura"))

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

document.getElementById("formularioRecuperarCuenta").onsubmit = (desactivarFormulario) => {
    desactivarFormulario.preventDefault();
    let correoIngresado = document.getElementById("email").value
    if (baseDeDatosDeUsuarios.some(usuarios => usuarios.correo == correoIngresado)) {
        existeElCorreo(baseDeDatosDeUsuarios.find(i => i.correo == correoIngresado))
    }else{
        Toastify({
            text: "El correo no está asociado a una cuenta",
            duration: 2000,
            stopOnFocus: true,
            gravity: "top",
            position: "center",
            style: {
                color: "#000",
                background: "#fff",
            }
        }).showToast();
    }
}

existeElCorreo = (recuperado) => {
    if (!document.getElementById("recuperado")){
        Toastify({
            text: "Se ha enviado un correo de recuperación",
            duration: 2000,
            stopOnFocus: true,
            gravity: "top",
            position: "center",
            style: {
                color: "#000",
                background: "#fff",
            }
        }).showToast();
        let disclaimer = document.createElement("div")
        disclaimer.setAttribute("class", "cuerpo")
        disclaimer.setAttribute("id", "recuperado")
        disclaimer.innerHTML = `<p>no sé como hacer eso del correo así que acá estaría una idea de lo que se enviaría:</p>
                                <p>Se ha realizado una recuperación de la contraseña de una cuenta de "La Casa de los tornillos de Carloh" vinculada a este correo, estos son los datos:</p>
                                <p>Nombre: ${recuperado.nombre.nombres}</p>
                                <p>Contraseña: ${recuperado.contraseña}</p>`
        document.getElementById("recuperarCuentaBody").insertBefore(disclaimer, document.getElementById("piePagina"))
    }else{
        Toastify({
            text: "Ya se ha enviado un correo",
            duration: 2000,
            stopOnFocus: true,
            gravity: "top",
            position: "center",
            style: {
                color: "#000",
                background: "#fff",
            }
        }).showToast();
    }
}