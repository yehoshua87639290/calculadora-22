var pantallaOperacion = document.getElementById("operacion");
var pantallaNumero = document.getElementById("numero");

var numeroActual = "";
var numeroAnterior = "";

var operadorElegido = null;
var empezarNuevo = false;
var contextoAudio = null;

function reproducirSonido(tipo) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!contextoAudio) contextoAudio = new AudioContext();
    if (contextoAudio.state === "suspended") contextoAudio.resume();

    var frecuencias = {numero: 520, operador: 680, accion: 420, igual: 820};
    var oscilador = contextoAudio.createOscillator();
    var ganancia = contextoAudio.createGain();
    var ahora = contextoAudio.currentTime;

    oscilador.type = "sine";
    oscilador.frequency.value = frecuencias[tipo] || frecuencias.accion;
    ganancia.gain.setValueAtTime(0.0001, ahora);
    ganancia.gain.exponentialRampToValueAtTime(0.08, ahora + 0.01);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.09);
    oscilador.connect(ganancia);
    ganancia.connect(contextoAudio.destination);
    oscilador.start(ahora);
    oscilador.stop(ahora + 0.1);
}

function actualizarPantalla() {
    if (numeroActual === ""){
        pantallaNumero.textContent = "0";
    }else{
        pantallaNumero.textContent = numeroActual;
    }

    if(pantallaOperacion.textContent === ""){
        pantallaOperacion.textContent = "0";
    }
}

function escribirNumero(digito) {
    if (empezarNuevo === true) {
        numeroActual = "";
        empezarNuevo = false;
    }

    if (numeroActual.length >= 12){
        return;
    }

    if (numeroActual === "0" && digito === "0"){
        return;
    }

    if (numeroActual === "0" && digito !== "0"){
        numeroActual = digito;
    }else{
        numeroActual = numeroActual + digito;
    }

    actualizarPantalla();
}

function escribirPunto(){
    if (empezarNuevo === true) {
        numeroActual = "0";
        empezarNuevo = false;
    }

    if (numeroActual.includes(".")){
        return;
    }

    if (numeroActual === ""){
        numeroActual = "0.";
    }

    numeroActual = numeroActual + ".";

    actualizarPantalla();
}

function elegirOperacion(operador){
    if (numeroActual === ""&& numeroAnterior === ""){
        return;
    }
   
    if(numeroActual !== "" && numeroAnterior !== "" && operadorElegido !== null){
        calcularResultado();
    }

    if(numeroActual !== ""){
        numeroAnterior = numeroActual;
    }

    operadorElegido = operador;

    numeroActual = "";
    empezarNuevo = false;

    resaltarOperador(operador);

    var simbolo = obtenerSimbolo(operador);
    pantallaOperacion.textContent = numeroAnterior + " " + simbolo;

    actualizarPantalla();
}

function calcularResultado(){
    if (numeroAnterior === "" || numeroActual === "" || operadorElegido === null){
        return;
    }

    var numA = parseFloat(numeroAnterior);
    var numB = parseFloat(numeroActual);

    var resultado;

    var simbolo = obtenerSimbolo(operadorElegido);
    pantallaOperacion.textContent = numA + " " + simbolo + " " + numB + " =";

    if (operadorElegido === "+"){
        resultado = numA + numB;
    }

    if (operadorElegido === "-"){
        resultado = numA - numB;
    }

    if (operadorElegido === "*"){
        resultado = numA * numB;
    }

    if (operadorElegido === "/"){
        if (numB === 0){
            mostrarError("no se puede dividir entre cero");
            return;
        }
        resultado = numA / numB;
    }
    resultado = parseFloat(resultado.toFixed(10));

    numeroActual = resultado.toString();

    numeroAnterior = "";
    operadorElegido = null;
   
    empezarNuevo = true;

    /*quitarResaltadoOperador();*/

    animarResultado();

    actualizarPantalla();
}

function limpiarPantalla(){
    numeroActual = "";
    numeroAnterior = "";
    operadorElegido = null;
    empezarNuevo = false;

    pantallaOperacion.textContent = "0";

    quitarResaltadoOperadores();
    actualizarPantalla();
}

function borrarUltimoDigito(){
    if (empezarNuevo === true){
        empezarNuevo = false;
    }

    if (numeroActual !== "") {
        numeroActual = numeroActual.slice(0, -1);
    } else {
        return;
    }

    actualizarPantalla();
}

function cambiarSigno(){
    if (numeroActual === "" || numeroActual === "0") return;
    numeroActual = numeroActual.startsWith("-")
        ? numeroActual.slice(1)
        : "-" + numeroActual;
    actualizarPantalla();
}

 
function calcularPorcentaje(){
    if (numeroActual === ""){
        return;
    }
    var numero = parseFloat(numeroActual);
    var resultado = numero / 100;

    pantallaOperacion.textContent = numero + "%";
    numeroActual = resultado.toString();

    actualizarPantalla();
}

function calcularRaiz(){
    if (numeroActual === ""){
        return;
    }
    var numero = parseFloat(numeroActual);

    if (numero < 0){
        mostrarError("error: raiz de negativo");
        return;
    }
    var resultado = Math.sqrt(numero);

    pantallaOperacion.textContent = "√(" + numero + ")";
    numeroActual = parseFloat(resultado.toPrecision(10)).toString();

    animarResultado();
    actualizarPantalla();
}

function calcularCuadrado(){
    if (numeroActual === ""){
        return;
    }

    var numero = parseFloat(numeroActual);
    var resultado = Math.pow(numero, 2);

    pantallaOperacion.textContent = "(" + numero + ")²";
    numeroActual = parseFloat(resultado.toPrecision(12)).toString();

    animarResultado();
    actualizarPantalla();
}

function calcularLogaritmo(){
    if (numeroActual === ""){
        return;
    }

    var numero = parseFloat(numeroActual);

    if (numero <= 0){
        mostrarError("error: log de <= 0");
        return;
    }

    var resultado = Math.log2(numero);

    pantallaOperacion.textContent = "log(" + numero + ")";
    numeroActual = parseFloat(resultado.toPrecision(10)).toString();

    animarResultado();
    actualizarPantalla();
}

function obtenerSimbolo(operador){
    if (operador === "+") return "+";
    if (operador === "-") return "-";
    if (operador === "*") return "×";
    if (operador === "/") return "÷";
    return operador;
}

document.addEventListener("keydown", function(evento) {
    var tecla = evento.key;
    if (tecla >= "0" && tecla <= "9") { reproducirSonido("numero"); escribirNumero(tecla); iluminarBoton("btn-" + tecla); }
    if (tecla === ".") { reproducirSonido("numero"); escribirPunto(); iluminarBoton("btn-punto"); }
    if (tecla === "+") { reproducirSonido("operador"); elegirOperacion("+"); iluminarBoton("btn-sumar"); }
    if (tecla === "-") { reproducirSonido("operador"); elegirOperacion("-"); iluminarBoton("btn-restar"); }
    if (tecla === "*") { reproducirSonido("operador"); elegirOperacion("*"); iluminarBoton("btn-multiplicar"); }
    if (tecla === "/") {
        evento.preventDefault();
        reproducirSonido("operador");
        elegirOperacion("/");
        iluminarBoton("btn-dividir");
    }

    if (tecla === "Enter" || tecla === "="){
        reproducirSonido("igual");
        calcularResultado();
        iluminarBoton("btn-igual");
    }

    if (tecla === "Backspace"){
        reproducirSonido("accion");
        borrarUltimoDigito();
        iluminarBoton("btn-borrar");
    }

    if (tecla === "Escape"){
        reproducirSonido("accion");
        limpiarPantalla();
        iluminarBoton("btn-limpiar");
    }


});

document.querySelectorAll(".btn").forEach(function(boton) {
    boton.addEventListener("click", function() {
        var tipo = boton.classList.contains("btn-numero") ? "numero" :
            boton.classList.contains("btn-operador") ? "operador" :
            boton.classList.contains("btn-igual") ? "igual" : "accion";
        reproducirSonido(tipo);
    });
});

function resaltarOperador(operador) {
    quitarResaltadoOperadores();
    var botones = {"+": "btn-sumar", "-": "btn-restar", "*": "btn-multiplicar", "/": "btn-dividir"};
    var boton = document.getElementById(botones[operador]);
    if (boton) boton.classList.add("activo");
}

function quitarResaltadoOperadores() {
    document.querySelectorAll(".btn-operador").forEach(function(boton) {
        boton.classList.remove("activo");
    });
}

function iluminarBoton(id) {
    var boton = document.getElementById(id);
    if (!boton) return;
    boton.classList.add("activo");
    setTimeout(function() { boton.classList.remove("activo"); }, 120);
}

function mostrarError(mensaje) {
    pantallaNumero.textContent = mensaje;
    pantallaNumero.classList.add("error");
    numeroActual = "";
    numeroAnterior = "";
    operadorElegido = null;
    setTimeout(function() {
        pantallaNumero.classList.remove("error");
        limpiarPantalla();
    }, 1400);
}

function animarResultado() {
    pantallaNumero.classList.add("animar");
    setTimeout(function(){
        pantallaNumero.classList.remove("animar");
    },300);
}