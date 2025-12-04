class DatosRepetidos {
    constructor(id, repeticiones){
        this.id = id
        this.repeticiones = repeticiones
    }
}

async function recuperarProductosDelCarrito(completo) {
    const URL = "../db/BaseDeDatosProductos.json"
    return fetch (URL)
        .then(response => response.json())
        .then(baseDeDatos => {
            let carrito = JSON.parse(localStorage.getItem("carrito")) ?? []
            let datosPreProcesados = []
            let datosProcesados = []
            let datosProcesadosSimplificados = []
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
            if (!completo) {
                datosProcesadosSimplificados = datosProcesados.map(dato => ({
                    titulo: dato.titulo,
                    precio: dato.precio,
                    duplicado: dato.duplicado,
                }))
                return datosProcesadosSimplificados
            }
            return datosProcesados
        })
    .catch((err)=> {
        throw new Error(err)
    })
}