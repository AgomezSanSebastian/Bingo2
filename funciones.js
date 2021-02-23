/********************************* Autor: Adrian Gomez Luna Fecha creación: 10/02/2021 Última modificación: dd/mm/aaaa Versión: x.xx ***********************************/

/**
 * Definición de las variables
 */
var nJugadores = 0; //Número de jugadores que jugará en el juego
var nGanadores = 0; //Número de ganadores, útil para la función de repartirPremio()
var precio = 0; //Precio que tendrá el cartón
var bombo = []; // Bombo es un array con todos los números del 1 al 90 para jugar al juego


/**
 * Función para preparar toda la vista del Bingo antes del comienzo del juego
 */
$("document").ready(function() {

    for (let index = 1; index <= 20; index++) {
        $("#mySelect").append("<option value=" + index + ">" + index + "</option>");
    }

    for (let index = 1; index <= 90; index++) {
        if (index == 11 || index == 21 || index == 31 || index == 41 ||
            index == 51 || index == 61 || index == 71 || index == 81) {
            $("#numeros").append("<br>");
        }

        $("#numeros").append("<span id='bola" + index + "' > " + index + " </span>");
    }

    //coregir las vista de la tabla
    $("#numeros").ready(function() {
        $("span").addClass("nuevaTablaBolas");
    });

    rellenarBombo();


})

/**
 * Función para rellenar el bombo con los números que hay en el juego
 */
function rellenarBombo() {
    for (let index = 1; index < 91; index++) {
        bombo[index] = index;
    }
}






/**
 * Función que genera un cartón de forma aleatoria
 */
function crear_carton() {
    var fila1 = [];
    var fila2 = [];
    var fila3 = [];
    var aleat;
    for (let index = 1; index < 10; index++) {
        aleat = [];
        if (index == 9) { //la última posición tiene que coger el 90
            aleat = aleatorio((index * 10), (index * 10) - 9);
            fila1[index - 1] = aleat[0];
            fila2[index - 1] = aleat[1];
            fila3[index - 1] = aleat[2];
        } else {
            aleat = aleatorio((index * 10) - 1, (index * 10) - 9);
            fila1[index - 1] = aleat[0];
            fila2[index - 1] = aleat[1];
            fila3[index - 1] = aleat[2];
        }
    }

    //añado 0 a las filas, 4 en total por fila
    fila1 = arregloFila(fila1);
    fila2 = arregloFila(fila2);
    fila3 = arregloFila(fila3);
    //Uno los 3 arrays en 1 solo
    var carton = fila1.concat(fila2, fila3);

    cargar_carton(carton);

}


/**
 * Función donde devuelvo números aleatorios para una columna para el cartón.
 * En los números aleatorios no se repiten y van ordenados.
 * 
 * @param {Integer} max 
 * @param {Integer} min 
 */
function aleatorio(max, min) {

    var num1, num2, num3;
    var repetir = false;
    var num = [];
    do {
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        num3 = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num1 == num2) {
            repetir = true;
        } else if (num1 == num3) {
            repetir = true;
        } else if (num2 == num3) {
            repetir = true;
        } else {
            repetir = false;
        }
    } while (repetir);

    num = [num1, num2, num3];

    return num.sort(function(a, b) {
        return a - b;
    });
}

/**
 * Función que añade 4 ceros a un array de forma aleatoria en las posiciones
 * 
 * @param {Array} numero 
 */
function arregloFila(numero) {
    var ceros = 0;
    var cero = 0;
    do {
        cero = Math.floor(Math.random() * (9 - 0) + 0);
        if (numero[cero] != 0) {
            numero[cero] = 0;
            ceros++;
        }
    } while (ceros < 4);

    return numero;
}


function cargar_carton(carton) {

    var filas = $("filas").val();
    var columnas = $("columnas").val();

    var tabla = "";
    var indice = 0;

    tabla += "<table class='table table-bordered'>";
    for (let fila = 1; fila < 4; fila++) {
        tabla += "<tr>";
        for (let columna = 1; columna < 10; columna++) {
            tabla += "<td>" + carton[indice] + "</td>";
            indice++;
        }
        tabla += "</tr>";
    }
    tabla += "</table>";

    $("#cartones").html(tabla);

}




/**
 * Función que nos devuelve la cantidad de dinero ganado
 */
function repartirPremio() {
    return ((nJugadores * precio) / nGanadores) * 0.8;
}