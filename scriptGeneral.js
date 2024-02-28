/* GESTIÓN DEL MODO CLARO Y OSCURO */

document.addEventListener(`DOMContentLoaded`, async function () {

    let boton = document.getElementById(`imagen-modo`);

    boton.addEventListener(`click`, cambiarModo);

    // Verificar el modo actual al cargar la página
    verificarModo();
});

function cambiarModo() {
    let body = document.body;
    let pokemons = Array.from(document.getElementsByClassName(`contenedor-elemento`));

    // Obtener el estado actual del modo
    let modoActual = body.classList.contains(`modo-oscuro`);

    if (modoActual) {
        body.classList.remove(`modo-oscuro`);
        body.classList.add(`modo-claro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.remove(`modo-oscuro`);
            pokemon.classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.remove(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(3)`).classList.remove(`modo-oscuro`);
        });

    }
    else {
        body.classList.remove(`modo-claro`);
        body.classList.add(`modo-oscuro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-oscuro`);
            pokemon.classList.remove(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.remove(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(3)`).classList.remove(`modo-claro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-oscuro`);
        });
    }

    //
    const modoActualizado = body.classList.contains(`modo-oscuro`);

    // Almacenar el estado actual en localStorage
    localStorage.setItem(`modo-oscuro-activado`, modoActualizado);
}

function verificarModo() {
    let body = document.body;
    let pokemons = Array.from(document.getElementsByClassName(`contenedor-elemento`));

    // Verificar si el modo oscuro está activo en localStorage
    let modoGuardado = localStorage.getItem(`modo-oscuro-activado`);

    // Si es la primera vez
    if (modoGuardado === null) {
        localStorage.setItem(`modo-oscuro-activado`, false);
        modoGuardado = localStorage.getItem(`modo-oscuro-activado`);
    }

    if (modoGuardado === `true`) {
        body.classList.add(`modo-oscuro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-oscuro`);
        });
    }
    else {
        body.classList.add(`modo-claro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-claro`);
        });
    }
}

/***********************************************************************************************************/
/* GESTIÓN DE LAS ANIMACIONES DE LAS TARJETAS */

// Establecer los colores de fondo de la tarjetas con los de su tipo
function animarFondoTarjeta(event) {

    // Pokemon seleccionado
    const tarjetaPokemon = event.currentTarget;
    // Contenedor de sus tipos
    const tipos = tarjetaPokemon.querySelector(`.contenedor-tipos`);
    // Color del tipo 1
    const color1 = window.getComputedStyle(tipos.querySelector(`:nth-child(1)`)).backgroundColor;
    // Color del tipo 2
    const color2 = tipos.querySelector(`:nth-child(2)`) ? window.getComputedStyle(tipos.querySelector(`:nth-child(2)`)).backgroundColor : null;
    // Establecer los colores de fondo de la tarjeta
    tarjetaPokemon.style.background = `linear-gradient(to left bottom, ${color1} 50%, ${color2 ? color2 : color1} 50%)`;

}

// Restablecer el color de la tarjeta
function restablecerFondoTarjeta(event) {
    const tarjetaPokemon = event.currentTarget;
    tarjetaPokemon.style.background = ``;
}

// Elementos animados de la lista
let elementosAnimados;