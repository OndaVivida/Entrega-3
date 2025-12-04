Santiago Alcorta

Simulador de ecommerce de una empresa de tornillos.
los botones que dicen "Botón que no existe" son botones dejados para autocompletar que no estarían realmente.
Para autocompletar la encuesta de venta se requiere una cuenta, <-- IMPORTANTE
eso sí sería parte de la página real

En iniciar sesión hay 2 botones:
Los botones Cargar usuario pre-CARGADO id:n° logea un usuario con todos los datos.
El botón Cargar usuario pre-CREADO funciona solo si se usó el botón de crear cuenta, este usuario es creado en el momento simulando los datos básicos del logeo por lo cual está "incompleto".

Permite crear cualquier cuenta y tiene 6 cuentas hardcodeadas en baseDeDatosUsuarios.js
Los botones Cargar usuario pre-CARGADO id:n° carga el usuario id:n° de las cuentas hardcodeadas, cualquiera funciona y todas tienen los datos completos.
Intenté que sea un .json para probar cosas pero hasta donde entendí no se puede modificar desde el google, así que quedó como .js; los productos sí están en un .json

*Aclaraciones*
La página tiene cierta inconsistencia en el estilo de los colores, no hice el curso de diseño.
Sé que nos dieron una guía de que no agregemos cosas que no aportan al funcionamiento de la página,
lo que pasó es que este proyecto lo fui haciendo a medida de las clases con los contenidos nuevos y se me transformó en una especie de base para probar cosas y ver cómo funcionan sin arrancar desde cero todo el rato
...y también me da lástima borrar todo :')