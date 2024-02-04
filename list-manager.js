// Array con los datos de los pokémon
const datosPokemon = [];

// Indica que la lista está creada
var listaCreada = false;

// Función para cargar la lista de Pokémon
async function cargarTodosPokemon() 
{
    // Cargar y guardar los datos de los 151 Pokémon
    for (var i = 1; i <= 151; i++) 
    {
        datosPokemon.push(await getPokemon(i));
    }
}


// Función hecha al inicio de cargar la página (carga todos los pokémon en la lista)
document.addEventListener(`DOMContentLoaded`, async function () {
    await cargarTodosPokemon();
    mostrarPokemonList(datosPokemon);
});

const buscador = document.getElementById(`buscador`);
// Función que se hace al usar el buscador, hace que solo aparezcan los pokémon que contengan el texto indicado
buscador.addEventListener(`input`, async function(event) {

    const busqueda = event.target.value.trim();
    filtrarListaPorNombre(busqueda);

    while (!listaCreada) 
    {
        await esperar(8); // Esperar 100 milisegundos antes de verificar de nuevo
    }

    verificarModo();
});


// Función que filtra los pokémon que empiezan por el string dado
async function filtrarListaPorNombre(busqueda)
{
    var listaFiltrada = datosPokemon.filter( function(pokemon) {
        return pokemon.forms[0].name.toLowerCase().includes(busqueda.toLowerCase());
    });

    mostrarPokemonList(listaFiltrada);

    // Si no hay resultados el borde del buscador es rojo
    if (busqueda.length > 0 && listaFiltrada.length == 0) 
    {
        buscador.classList.remove(`conResultados`);
        buscador.classList.add(`sinResultados`);
    } 
    // Si hay resultados el borde del buscador es verde
    else if (busqueda.length > 0 && listaFiltrada.length > 0)
    {
        buscador.classList.remove(`sinResultados`);
        buscador.classList.add(`conResultados`);
    }
    // Si no hay texto en el buscador se queda azul
    else 
    {
        buscador.classList.remove(`conResultados`);
        buscador.classList.remove(`sinResultados`);
    }

}


// Crea la lista con los pokémon que se les pasa por datos
async function mostrarPokemonList(datos) {

    listaCreada = false;

    // Obtener la referencia del elemento ul
    var lista = document.getElementById(`lista-pokemons`);

    // Limpiar la lista antes de agregar nuevos elementos
    lista.innerHTML = ``;

    // Iterar sobre los datos y generar elementos 
    for (var i = 0; i < datos.length; i++) {

        // Calculamos el string adaptado a 3 cifras del número del pokémon
        var numeroPokemon = String(datos[i].id).padStart(3, '0');

        // Crear un nuevo elemento
        var nuevoElemento = document.createElement(`div`);
        // Configurar el contenido, estilo y clase del nuevo elemento
        nuevoElemento.className = `contenedor-elemento`;


        // Creamos el enlace clickeable de la imagen
        var urlImagen = document.createElement(`a`);
        urlImagen.href = ``;
        // Creamos la imagen del pokémon
        var imagen = document.createElement(`img`);
        imagen.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${numeroPokemon}.png`;
        // La hacemos clickeable
        urlImagen.appendChild(imagen);
        // Añadir enlace/imagen al elemento
        nuevoElemento.appendChild(urlImagen);


        // Creamos el contenedor del nombre
        var divNumero = document.createElement(`div`);
        divNumero.className = `contenedor-numero`;
        divNumero.textContent = `Nº ` + numeroPokemon;
        // Añadir contenedor del nombre al elemento
        nuevoElemento.appendChild(divNumero);


        // Obtener nombre y poner primera letra en mayúscula
        var nombrePokemon = datos[i].name;
        nombrePokemon = nombrePokemon.charAt(0).toUpperCase() + nombrePokemon.slice(1);
        // Creamos el contenedor del nombre
        var divNombre = document.createElement(`div`);
        divNombre.className = `contenedor-nombre`;
        divNombre.textContent = nombrePokemon;
        // Añadir contenedor del nombre al elemento
        nuevoElemento.appendChild(divNombre);


        // Creamos el contenedor de los tipos
        var divTipos = document.createElement(`div`);
        divTipos.className = `contenedor-tipos`;

        // Creamos el contenedor del primer tipo
        var divTipo1 = document.createElement(`div`);
        // Creamos el contenedor del texto
        var textoTipo1 = document.createElement(`div`);
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

        // Añadir si tiene segundo tipo
        if (datos[i].types[1] != null) 
        {
            // Creamos el contenedor del segundo tipo
            var divTipo2 = document.createElement(`div`);
            // Creamos el contenedor del texto
            var textoTipo2 = document.createElement(`div`);
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
        }

        // Añadir contenedor de los tipos al elemento
        nuevoElemento.appendChild(divTipos);

        // Añadir el elemento a la fila
        lista.appendChild(nuevoElemento);
    }

    if(datos.length === 0)
    {
        var mensajeError = document.createElement(`div`);
        mensajeError.className = `mensaje-error`;
        mensajeError.textContent = `No se han encontrado coincidencias, por favor revise su búsqueda.`;
        lista.appendChild(mensajeError);
    }

    listaCreada = true;
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