/********************************* Autor: Adrian Gomez Luna Fecha creación: 10/02/2021 Última modificación: dd/mm/aaaa Versión: x.xx ***********************************/

/**
 * Definición de las variables
 */
var nJugadores = 0; //Número de jugadores que jugará en el juego
var velocidad = 3000; //Velocidad del juego
var nGanadores = 0; //Número de ganadores, útil para la función de repartirPremio()
var precio = 0; //Precio que tendrá el cartón
var bombo = []; // Bombo es un array con todos los números del 1 al 90 para jugar al juego
var bomboNumeroSalido = []; //bombo con los números que ya han salido

var cartones = []; //cartones de todos los jugadores, es array de arrays


/**
 * Función para preparar toda la vista del Bingo antes del comienzo del juego
 */
$("document").ready(function() {

    for (let index = 5; index <= 20; index++) {
        $("#njugador").append("<option value=" + index + ">" + index + "</option>");
    }

    for (let index = 1; index <= 5; index++) {
        $("#precio").append("<option value=" + index + ">" + index + "</option>");
    }

    colocarNumeros();


    //coregir las vista de la tabla de los numeros
    $("#numeros").ready(function() {
        $("span").addClass("nuevaTablaBolas");
    });

    //rellenarBombo();

})


/**
 * Función que inicia una partida nueva. Es llamada desde el botón de inicio de partida
 */
function iniciarJuego() {

    //Guarda la configuración del juego
    nJugadores = document.getElementById("njugador").value;
    velocidad = document.getElementById("velo").value;
    precio = document.getElementById("precio").value;

    document.getElementById("btnInicio").style.display = "none";

    rellenarBombo();

    for (let index = 1; index <= nJugadores; index++) {
        cartones.push(crear_carton());

    }

    comenzar();


}


/**
 * Función que comienza a sacar bolas
 */
function comenzar() {
    juego = setInterval(dameBola_Ajax, velocidad);
}

/**
 * Función que para el sacar bolas del bombo
 */
function stop() {
    clearInterval(juego);
}

/**
 * Recarga una nueva partida recargando la pantalla
 */
function nuevaPartida() {
    location.reload();
}

/**
 * Función que dibuja la tabla de los números del bombo
 */
function colocarNumeros() {

    var tabla = document.createElement("table");
    tabla.classList.add('tablaNumeros');
    var fila = document.createElement("tr");

    for (let index = 1; index <= 90; index++) {
        if (index == 11 || index == 21 || index == 31 || index == 41 ||
            index == 51 || index == 61 || index == 71 || index == 81) {
            tabla.appendChild(fila);
            fila = document.createElement("tr");
        }
        var hueco = document.createElement("td");
        hueco.setAttribute("id", "N" + index);
        hueco.innerHTML = index;
        fila.appendChild(hueco);

        if (index == 90) {
            tabla.appendChild(fila);
        }
    }
    var zona = document.getElementById("numeros");
    zona.appendChild(tabla);

    //OTRA FORMA DE HACERLA
    // var tabla = document.createElement("table");

    // for (let filas = 0; filas < 10; filas++) {
    //     var fila = document.createElement("tr");

    //     for (let columna = 1; columna < 11; columna++) {
    //         var hueco = document.createElement("td");
    //         hueco.setAttribute("id", filas + "/" + columna);
    //         hueco.innerHTML = filas + "" + columna;
    //         fila.appendChild(hueco);
    //     }
    //     tabla.appendChild(fila);
    // }

    // var zona = document.getElementById("numeros");
    // zona.appendChild(tabla);
}

//-------------------BOMBO-------------------

/**
 * Función para rellenar el bombo con los números que hay en el juego
 */
function rellenarBombo() {
    for (let index = 1; index < 91; index++) {
        bombo.push(index);
    }
}

/**
 * Función AJAX
 */
function dameBola_Ajax() {
    $.ajax({
        type: "POST",
        url: "bola.php",
        datatype: "text",
        data: { bolas: bombo },
        success: dameBola,
    });
}

/**
 * Da los números que van saliendo del bombo y los coloca en un nuevo array para controlar las bolas que hayan
 * salido. Además va coloreando los números que hayan salido en la tabla de números.
 * @param {int} numero 
 */
function dameBola(numero) {
    newBola = bombo[numero];
    bomboNumeroSalido.push(newBola);

    if (bomboNumeroSalido.length < 91) {
        bombo.splice(numero, 1); //Quitamos la bola del bombo
        document.getElementById("bola").innerHTML = newBola;
        let num = parseInt(numero) + 1;
        var celda = document.getElementById("N" + newBola);
        celda.classList.toggle('colorear');
        comprobarBingoRivales();

    } else {
        nuevaPartida();
        alert("Se han sacado todos los números");
    }
}


//-----------------------------CARTÓN----------------------------------

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

    dibujar_carton(carton);

    return carton;
}


/**
 * Función donde devuelvo números aleatorios para una columna para el cartón.
 * Los números aleatorios no se repiten y van ordenados.
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
 * Función que añade 4 ceros a un array de forma aleatoria 
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

/**
 * Función que pinta un cartón de bingo. Se le pasa un array con los valores a pintar.
 * @param {Array} carton 
 */
function dibujar_carton(carton) {
    var indice = 0;
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "player");
    tabla.classList.add('player');
    tabla.classList.add('mb-2')


    for (let filas = 1; filas < 4; filas++) {
        var fila = document.createElement("tr");

        for (let columnas = 1; columnas < 10; columnas++) {
            var hueco = document.createElement("td");
            hueco.setAttribute("id", cartones.length + "" + indice);

            if (carton[indice] == 0) {
                hueco.classList.add('vacia');
            } else {
                hueco.innerHTML = carton[indice];
                if (cartones.length == 0) { //Si es el del jugador le añadimos un evento de pulsación
                    hueco.addEventListener("click", function() {
                        acierto(this.id);
                    });
                }
            }
            fila.appendChild(hueco);
            indice++;
        }
        tabla.appendChild(fila);
    }

    var zonaJuego = document.getElementById("cartones");
    zonaJuego.appendChild(tabla);
}

/**
 * Función que le añade la clase de acierto o no a la celda pasada por su id
 * @param {string} id 
 */
function acierto(id) {
    var celda = document.getElementById(id);

    celda.classList.toggle('acierto');
}



/**
 * Funcion que pinta el tablero de un carton
 * @param {carton} carton 
 */
// function cargar_carton(carton) {

//     var filas = $("filas").val();
//     var columnas = $("columnas").val();

//     var tabla = "";
//     var indice = 0;

//     tabla += "<table class='table table-bordered'>";
//     for (let fila = 1; fila < 4; fila++) {
//         tabla += "<tr>";
//         for (let columna = 1; columna < 10; columna++) {
//             tabla += "<td>" + carton[indice] + "</td>";
//             indice++;
//         }
//         tabla += "</tr>";
//     }
//     tabla += "</table>";

//     //$("#cartones").html(tabla);

// }

/**
 * Funcion que se activa al pulsar el botón de bingo para el jugador. Y llama a la función comprobarBingo para 
 * saber si tiene esos 15 aciertos. Si tiene bingo o no saca una nueva ventana emergente con la situación
 */
function bingo() {
    stop();

    if (compruebaBingo(0)) {
        var nuevaVentana = window.open("bingoOK.html", "_blank", "width=300px, height=200px");
        var premio = repartirPremio();
        nuevaVentana.onload = function() {
            nuevaVentana.document.getElementById("premio").innerHTML = premio;
        };
    } else {
        var nuevaVentana = window.open("bingoNO.html", "_blank", "width=300px, height=200px");
    }
}

/**
 * Función que comprueba si el cartón enviado por indice tiene los 15 aciertos que garantiza 
 * ser el ganador. Y Pintamos las casillas que coincidan con el acierto del número.
 * @param {int} indice 
 */
function compruebaBingo(indice) {
    var valores = cartones[indice];
    var bingo = false;
    var aciertos = 0;

    for (let index = 0; index < valores.length; index++) {
        if (bomboNumeroSalido.includes(valores[index])) {
            aciertos++;
            if (index > 0) {
                var tabla = document.getElementById("cartones").getElementsByTagName("table")[indice];
                Array.from(tabla.getElementsByTagName("td")).forEach(td => {
                    if (parseInt(td.innerHTML) == bomboNumeroSalido[bomboNumeroSalido.length - 1]) {
                        $(td).addClass("colorear");
                    }
                })
            }
        }
    }

    if (aciertos == 15) {
        bingo = true;
    }

    return bingo;
}

/**
 * Función que va comprobando todos los cartones de la máquina para saber si hay algún ganador. 
 * Si coinciden de que haya 15 aciertos en un cartón o más, se añade a ganadores. 
 * Y sacamos una ventana emergente con la situación.
 */
function comprobarBingoRivales() {

    for (let index = 1; index < cartones.length; index++) {
        if (compruebaBingo(index)) {
            nGanadores++;
        }
    }
    //Hay al menos un ganador
    if (nGanadores >= 1) {
        stop();
        var newVentana = window.open("ganaMaquina.html", "_blank", "width= 300px, height= 200px");
        var premio = repartirPremio();
        newVentana.onload = function() {
            newVentana.document.getElementById("premio").innerHTML = premio;
        };
    }
}



/**
 * Función que nos devuelve la cantidad de dinero ganado
 */
function repartirPremio() {
    return ((nJugadores * precio) / nGanadores) * 0.8;
}