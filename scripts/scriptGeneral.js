/* FUNCIONES AUXILIARES/COMÚNES */

// Manda al sessionStorage el número pokémon que cargará en la segunda vista
function guardarNumeroPokemon(num) 
{
  // Guardar número en sessionStorage
  sessionStorage.setItem(`numeroPokemonSeleccionado`, num);
}

extensiones = [`-altered`, `-plant`, `-normal`, `-land`];
// Corrección de los nombres
function corregirNombre(nombre) {
    
    for(let i=0; i<extensiones.length; i++)
    {
        if(nombre.endsWith(extensiones[i]))
        {
            nombre = nombre.slice(0, -extensiones[i].length);
            return nombre;
        }
    }

    return nombre;
}

const generaciones = [`i`, `ii`, `iii`, `iv`];
// Devuelve true si el pokemon pertenece a una de las generaciones del array
function aceptarGeneracion(datos) {
  const numGeneracion = datos.generation.name.slice(11);
  if (generaciones.includes(numGeneracion)) {
    return true;
  }
  return false;
}

// Traduce el tipo de un pokémon al español
function traducirTipo(tipo) {
    switch (tipo) {
        case `normal`:
            return `Normal`;
        case `fighting`:
            return `Lucha`;
        case `flying`:
            return `Volador`;
        case `poison`:
            return `Veneno`;
        case `ground`:
            return `Tierra`;
        case `rock`:
            return `Roca`;
        case `bug`:
            return `Bicho`;
        case `ghost`:
            return `Fantasma`;
        case `steel`:
            return `Acero`;
        case `fire`:
            return `Fuego`;
        case `water`:
            return `Agua`;
        case `grass`:
            return `Planta`;
        case `electric`:
            return `Eléctrico`;
        case `psychic`:
            return `Psíquico`;
        case `ice`:
            return `Hielo`;
        case `dragon`:
            return `Dragón`;
        case `dark`:
            return `Siniestro`;
        case `fairy`:
            return `Hada`;
        default:
            return ``; // Vacío si no es ninguno de los tipos que hay
    }
}

/***********************************************************************************************************/
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

    // Almacenar el estado actual
    sessionStorage.setItem(`modo-oscuro-activado`, modoActualizado);
    localStorage.setItem(`modo-oscuro-activado`, modoActualizado);
}

function verificarModo() {
    let body = document.body;
    let pokemons = Array.from(document.getElementsByClassName(`contenedor-elemento`));

    // Verificar si el modo oscuro está activo en sessionStorage
    let modoGuardado = sessionStorage.getItem(`modo-oscuro-activado`);

    if(modoGuardado === null)
    {
        modoGuardado = localStorage.getItem(`modo-oscuro-activado`);
    }
    else 
    {
        localStorage.setItem(`modo-oscuro-activado`, modoGuardado);
    }

    // Si es la primera vez
    if (modoGuardado === null) {
        sessionStorage.setItem(`modo-oscuro-activado`, false);
        localStorage.setItem(`modo-oscuro-activado`, false);
        modoGuardado = localStorage.getItem(`modo-oscuro-activado`);
    }

    if (modoGuardado === `true`) {
        sessionStorage.setItem(`modo-oscuro-activado`, true);
        body.classList.add(`modo-oscuro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-oscuro`);
        });
    }
    else {
        sessionStorage.setItem(`modo-oscuro-activado`, false);
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