Santiago Alcorta

Simulador de ecommerce de una empresa de tornillos.
los botones que dicen "Botón que no existe" son botones dejados para autocompletar que no estarían realmente.
Para autocompletar la encuesta de venta se requiere una cuenta, <-- IMPORTANTE
eso sí sería parte de la página real

en iniciar sesión hay 2 botones:
los botones Cargar usuario pre-CARGADO id:n° logea un usuario con todos los datos.
el botón Cargar usuario pre-CREADO funciona solo si se usó el botón de crear cuenta, este usuario es creado en el momento simulando los datos básicos del logeo por lo cual está "incompleto".

permite crear cualquier cuenta y tiene 6 cuentas hardcodeadas en baseDeDatosUsuarios.js
los botones Cargar usuario pre-CARGADO id:n° carga el usuario id:n° de la lista, recomiendo el 6to pero cualquiera funciona.
intenté que sea un .json para probar cosas pero hasta donde entendí no se puede modificar desde el google, así que quedó como .js
los productos si están en un .json


Sé que nos dieron una guía de que no agregemos cosas que no aportan al funcionamiento de la página,
lo que pasó es que este proyecto lo fui haciendo a medida de las clases con los contenidos nuevos y se me transformó en una especie de base para probar cosas y ver cómo funcionan sin arrancar desde cero todo el rato
...y también me da lástima borrar todo :')