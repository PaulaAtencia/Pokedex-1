/* GESTIÓN DE LA LISTA DE POKÉMONS */

// Array con los datos de los pokémon
const datosPokemon = [];

// Función para cargar la lista de Pokémon
async function cargarTodosPokemon() {
    // Cargar y guardar los datos de los 151 Pokémon
    for (let i = 1; i <= 151; i++) {
        datosPokemon.push(await getPokemon(i));
    }
}


// Función hecha al inicio de cargar la página (carga todos los pokémon en la lista)
document.addEventListener(`DOMContentLoaded`, async function () {

    await cargarTodosPokemon();
    await mostrarPokemonList(datosPokemon);

});

const buscador = document.getElementById(`buscador`);
// Función que se hace al usar el buscador, hace que solo aparezcan los pokémon que contengan el texto indicado
buscador.addEventListener(`input`, async function (event) {

    const busqueda = event.target.value.trim();

    await filtrarListaPorNombre(busqueda);

    verificarModo();
});


// Función que filtra los pokémon que empiezan por el string dado
async function filtrarListaPorNombre(busqueda) {
    let listaFiltrada = datosPokemon.filter(function (pokemon) {
        return pokemon.forms[0].name.toLowerCase().includes(busqueda.toLowerCase());
    });

    mostrarPokemonList(listaFiltrada);

    // Si no hay resultados el borde del buscador es rojo
    if (busqueda.length > 0 && listaFiltrada.length == 0) {
        buscador.classList.remove(`conResultados`);
        buscador.classList.add(`sinResultados`);
    }
    // Si hay resultados el borde del buscador es verde
    else if (busqueda.length > 0 && listaFiltrada.length > 0) {
        buscador.classList.remove(`sinResultados`);
        buscador.classList.add(`conResultados`);
    }
    // Si no hay texto en el buscador se queda azul
    else {
        buscador.classList.remove(`conResultados`);
        buscador.classList.remove(`sinResultados`);
    }

}

// Lista de pokemons
const lista = document.getElementById(`lista-pokemons`);


// Crea la lista con los pokémon que se les pasa por datos
async function mostrarPokemonList(datos) {

    // Limpiar la lista antes de agregar nuevos elementos
    lista.innerHTML = ``;

    // Iterar sobre los datos y generar elementos 
    for (let i = 0; i < datos.length; i++) {

        // Calculamos el string adaptado a 3 cifras del número del pokémon
        let numeroPokemon = String(datos[i].id).padStart(3, `0`);

        // Crear un nuevo elemento
        let nuevoElemento = document.createElement(`div`);
        // Configurar el contenido, estilo y clase del nuevo elemento
        nuevoElemento.className = `contenedor-elemento elemento-animado`;


        // Creamos el enlace clickeable de la imagen
        let urlImagen = document.createElement(`a`);
        urlImagen.href = ``;
        // Creamos la imagen del pokémon
        let imagen = document.createElement(`img`);
        imagen.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${numeroPokemon}.png`;
        // La hacemos clickeable
        urlImagen.appendChild(imagen);
        // Añadir enlace/imagen al elemento
        nuevoElemento.appendChild(urlImagen);


        // Creamos el contenedor del nombre
        let divNumero = document.createElement(`div`);
        divNumero.className = `contenedor-numero`;
        divNumero.textContent = `Nº ` + numeroPokemon;
        // Añadir contenedor del nombre al elemento
        nuevoElemento.appendChild(divNumero);


        // Obtener nombre y poner primera letra en mayúscula
        let nombrePokemon = datos[i].name;
        nombrePokemon = nombrePokemon.charAt(0).toUpperCase() + nombrePokemon.slice(1);
        // Creamos el contenedor del nombre
        let divNombre = document.createElement(`div`);
        divNombre.className = `contenedor-nombre`;
        divNombre.textContent = nombrePokemon;
        // Añadir contenedor del nombre al elemento
        nuevoElemento.appendChild(divNombre);


        // Creamos el contenedor de los tipos
        let divTipos = document.createElement(`div`);
        divTipos.className = `contenedor-tipos`;

        // Creamos el contenedor del primer tipo
        let divTipo1 = document.createElement(`div`);
        // Creamos el contenedor del texto
        let textoTipo1 = document.createElement(`div`);
        textoTipo1.className = `contenedor-texto-tipo`;
        // Traducimos el primer tipo y lo añadimos al contenedor
        textoTipo1.textContent = await traducirTipo(datos[i].types[0].type.name);
        // Añadimos las clases del contenedor (la segunda sirve para el color de fondo)
        divTipo1.className = `contenedor-tipo ` + textoTipo1.textContent;
        // Añadimos el texto del tipo al contenedor del tipo
        divTipo1.appendChild(textoTipo1);
        // Añadimos el tamaño del contenedor
        divTipo1.width = textoTipo1.width * 3;
        // Añadir contenedor de tipo 1 a Tipos
        divTipos.appendChild(divTipo1);
        // Añadir tipo 1 a las clase del elemento
        nuevoElemento.classList.add(textoTipo1.textContent + `t1`);
        // Añadimos tipo 2 a las clase del elemento como si fuera nulo (por si no tiene)
        nuevoElemento.classList.add(`nullt2`);

        // Añadir si tiene segundo tipo
        if (datos[i].types[1] != null) {
            // Creamos el contenedor del segundo tipo
            let divTipo2 = document.createElement(`div`);
            // Creamos el contenedor del texto
            let textoTipo2 = document.createElement(`div`);
            textoTipo2.className = `contenedor-texto-tipo`;
            // Traducimos el segundo tipo y lo añadimos al contenedor
            textoTipo2.textContent = await traducirTipo(datos[i].types[1].type.name);
            // Añadimos las clases del contenedor (la segunda sirve para el color de fondo)
            divTipo2.className = `contenedor-tipo ` + textoTipo2.textContent;
            // Añadimos el texto del tipo al contenedor del tipo
            divTipo2.appendChild(textoTipo2);
            // Añadimos el tamaño del contenedor
            divTipo2.width = textoTipo2.width * 3;
            // Añadir contenedor de tipo 2 a Tipos
            divTipos.appendChild(divTipo2);
            // Añadir tipo 2 a las clase del elemento
            nuevoElemento.classList.add(textoTipo2.textContent + `t2`);
        }

        // Añadir contenedor de los tipos al elemento
        nuevoElemento.appendChild(divTipos);

        // Añadir el elemento a la fila
        lista.appendChild(nuevoElemento);
    }

    if (datos.length === 0) {
        let mensajeError = document.createElement(`div`);
        mensajeError.className = `mensaje-error`;
        mensajeError.textContent = `No se han encontrado coincidencias, por favor revise su búsqueda.`;
        lista.appendChild(mensajeError);
    }

    verificarModo(); // Revisa el modo claro/oscuro para la lista
    controlFlechas(); // Revisa la aparición de las flechas
    elementosAnimados = document.querySelectorAll(`.elemento-animado`); // Actualizar lista para las animaciones

    // Establecer animaciones a los elementos de la lista
    elementosAnimados.forEach(elemento => {
        elemento.addEventListener(`mouseover`, animarFondoTarjeta);
        elemento.addEventListener(`mouseout`, restablecerFondoTarjeta);
    });
}

// Obtiene los datos de un pokemon pasando su id o su nombre
async function getPokemon(id) {
    const pokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return pokemon;
}

async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// Traduce el tipo de un pokémon al español
async function traducirTipo(tipo) {
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
            return ``;
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
/* GESTIÓN DE LAS FLECHAS */

// Imagen que te envía al fondo de la lista
const flechaAbajo = document.getElementById(`contenedor-flecha-abajo`);
// Función que realiza la acción al clickear la imagen
flechaAbajo.addEventListener(`click`, function () {
    window.scrollTo({ top: document.body.scrollHeight, behavior: `smooth` });
});

// Imagen que te envía al inicio de la lista
const flechaArriba = document.getElementById(`contenedor-flecha-arriba`);
// Función que realiza la acción al clickear la imagen
flechaArriba.addEventListener(`click`, function () {
    window.scrollTo({ top: 0, behavior: `smooth` });
});

// Función para mostrar/ocultar las flechas según la posición donde estás en la página
function controlFlechas() {
    //La flecha que desciende hasta abajo no sale si estás en la parte más baja
    if (window.scrollY < (document.body.offsetHeight - window.innerHeight)) {
        // Se muestra
        flechaAbajo.style.display = `block`;
    }
    else {
        // Se oculta
        flechaAbajo.style.display = `none`;
    }

    // La flecha que sube hasta arriba no sale si estas en la parte más alta
    if (window.scrollY > 8) {
        // Se muestra
        flechaArriba.style.display = `block`;
    }
    else {
        // Se oculta
        flechaArriba.style.display = `none`;
    }
}

// La acción de scroll activa la función
window.addEventListener(`scroll`, controlFlechas);

/***********************************************************************************************************/
/* GESTIÓN DE LAS ANIMACIONES DE LAS TARJETAS */

// Establecer los colores de fondo de la tarjetas con los de su tipo
function animarFondoTarjeta(event) {

    // Pokemon seleccionado
    const tarjetaPokemon = event.currentTarget;
    // Contenedor de sus tipos
    const tipos = tarjetaPokemon.querySelector('.contenedor-tipos');
    // Color del tipo 1
    const color1 = window.getComputedStyle(tipos.querySelector(':nth-child(1)')).backgroundColor;
    // Color del tipo 2
    const color2 = tipos.querySelector(':nth-child(2)') ? window.getComputedStyle(tipos.querySelector(':nth-child(2)')).backgroundColor : null;
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