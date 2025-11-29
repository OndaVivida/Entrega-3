// parece ser que el static id no funciona le meti un parche para hacerlo mas inseguro si cabe
class CreadorUsuarios{
    static id = parseInt(localStorage.getItem("ultimoId")) || 0
    constructor(nombres, correo, contraseña, apellidos, codigoPostal, localidad, calle, tipoDepartamento = false, numero, departamento = null){
        this.id = ++CreadorUsuarios.id
        localStorage.setItem("ultimoId", CreadorUsuarios.id)
        this.correo = correo
        this.contraseña = contraseña
        this.nombre = {
            nombres: nombres,
            apellidos: apellidos,
        }
        this.direccion = {
            codigoPostal: codigoPostal,
            localidad: localidad,
            calle: calle,
            tipoDepartamento: tipoDepartamento,
            alturaCalle: numero,
            numeroDepartamento: departamento,
        }
    }
}

if (!localStorage.getItem("Base de Datos de Usuarios Insegura")) {
    let baseDeDatosDeUsuarios = [
        new CreadorUsuarios("admin", "admin@lodecarloh.com", "admin", "general", "B800", "Bahía blanca", "Ángel Brunel", false, 11),
        new CreadorUsuarios("Carloh", "carloh@lodecarloh.com", "admin", "ceo", "B800", "Bahía blanca", "Ángel Brunel", false, 1),
        new CreadorUsuarios("Arnold", "testDe@departamento.com", "ioPoi", "Schwarzenegger", "T-800", "Estanislao del Campo", "Salvatierra", true, 1234, 7),
        new CreadorUsuarios("me", "encanta@que.la", "Contraseña", "este", "guardada", "en", "Texto Plano", true, 99, 3),
        new CreadorUsuarios("Ander Edinson", "anedison@airemradgem.net", "Bl0r3ft", "Joma Oney", "BP-12", "Bloreft", "Av. Florales", false, 693),
        new CreadorUsuarios("Juan", "correoDe@Prueba.com", "defecto", "Alvarez", "cpostal", "Bolivar", "San Martín", true, 357, 9)
    ]
    localStorage.setItem("Base de Datos de Usuarios Insegura", JSON.stringify(baseDeDatosDeUsuarios))
}