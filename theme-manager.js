
document.addEventListener(`DOMContentLoaded`, async function () {

    var boton = document.getElementById(`imagen-modo`);

    boton.addEventListener(`click`, cambiarModo);

    while (!listaCreada) 
    {
        await esperar(100); // Esperar 100 milisegundos antes de verificar de nuevo
    }

    // Verificar el modo actual al cargar la página
    verificarModo();
});

// Función para simular un tiempo de espera
function esperar(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cambiarModo() 
{
    var body = document.body;
    var pokemons = Array.from(document.getElementsByClassName(`contenedor-elemento`));

    // Obtener el estado actual del modo
    var modoActual = body.classList.contains(`modo-oscuro`);

    if (modoActual) 
    {
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
    else 
    {
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

function verificarModo() 
{
    var body = document.body;
    var pokemons = Array.from(document.getElementsByClassName(`contenedor-elemento`));

    // Verificar si el modo oscuro está activo en localStorage
    var modoGuardado = localStorage.getItem(`modo-oscuro-activado`);

    // Si es la primera vez
    if(modoGuardado === null)
    {
        localStorage.setItem(`modo-oscuro-activado`, false);
        modoGuardado = localStorage.getItem(`modo-oscuro-activado`);
    }

    if (modoGuardado === `true`) 
    {
        body.classList.add(`modo-oscuro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-oscuro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-oscuro`);
        });
    } 
    else 
    {
        body.classList.add(`modo-claro`);

        pokemons.forEach(pokemon => {
            pokemon.classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(2)`).classList.add(`modo-claro`);
            pokemon.querySelector(`:nth-child(3)`).classList.add(`modo-claro`);
        });
    }
}