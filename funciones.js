/********************************* Autor: Adrian Gomez Luna Fecha creación: 10/02/2021 Última modificación: dd/mm/aaaa Versión: x.xx ***********************************/

/**
 * Definición de las variables
 */
var nJugadores = 0; //Número de jugadores que jugará en el juego
var precio = 0; //Precio que tendrá el cartón
var bombo = []; // Bombo es un array con todos los números del 1 al 90 para jugar al juego


/**
 * Función para preparar toda la vista del Bingo antes del comienzo del juego
 */
$("document").ready(function() {

    $("header").append("<img src>")

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




function aleatorio() {

}