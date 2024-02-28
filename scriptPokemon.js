const statTranslations = {
  'hp': `Puntos de Salud`,
  'attack': `Ataque`,
  'defens': `Defensa`,
  'special-attack': `Ataque Especial`,
  'special-defense': `Defensa Especial`,
  'speed': `Velocidad`
};

// Función hecha al inicio de cargar la página (carga el pokemon seleccionado y lo muestra)
document.addEventListener(`DOMContentLoaded`, async function () {
  const numeroPokemon = await obtenerNumeroPokemon();
  const datos = await traerPokemon(numeroPokemon);
  await crearPokemon(datos);
  await mostrarEstadisticasPokemon(datos.id);
  await crearCadenaEvolutiva(datos.id);
  verificarModo();
});

// Obtener el número del pokemon que se seleccionó antes de entrar a esta vista
async function obtenerNumeroPokemon() {
  return localStorage.getItem(`numeroPokemonSeleccionado`);
}

async function traerPokemon(num) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
    if (!response.ok) {
      throw new Error(`No se pudo obtener los datos de la PokeAPI`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener los datos:`, error);
  }
}

async function crearPokemon(pokemon) {
  // Calculamos el string adaptado a 3 cifras del número del pokémon
  let numeroPokemon = String(pokemon.id).padStart(3, `0`);

  const img = document.createElement(`img`);
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${numeroPokemon}.png`;

  const div = document.createElement(`div`);
  div.appendChild(img);

  const h3Nombre = document.createElement(`h3`);
  h3Nombre.textContent = `Nombre: ` + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  div.appendChild(h3Nombre);

  const h3Id = document.createElement(`h3`);
  h3Id.textContent = `ID: ` + numeroPokemon;
  div.appendChild(h3Id);

  const h3Altura = document.createElement(`h3`);
  h3Altura.textContent = `Altura: ` + pokemon.height;
  div.appendChild(h3Altura);


  const h3Peso = document.createElement(`h3`);
  h3Peso.textContent = `Peso: ` + pokemon.weight;
  div.appendChild(h3Peso);


  const h3Types = document.createElement(`h3`);
  h3Types.textContent = `Tipos: `;
  await pokemon.types.forEach(type => {
    const spanType = document.createElement(`span`);
    const tipoTraducido = traducirTipo(type.type.name);
    spanType.textContent = tipoTraducido;
    h3Types.appendChild(spanType);
    h3Types.appendChild(document.createTextNode(`, `)); // Separador
  });
  // Eliminar la última coma y espacio
  h3Types.textContent = h3Types.textContent.slice(0, -2);
  div.appendChild(h3Types);

  document.getElementById(`pokemonContainer`).appendChild(div);
}


function traducirTipo(tipo) {
  switch (tipo) {
    case `normal`:
      return `Normal`;
    case `fire`:
      return `Fuego`;
    case `water`:
      return `Agua`;
    case `electric`:
      return `Eléctrico`;
    case `grass`:
      return `Planta`;
    case `ice`:
      return `Hielo`;
    case `fighting`:
      return `Lucha`;
    case `poison`:
      return `Veneno`;
    case `ground`:
      return `Tierra`;
    case `flying`:
      return `Volador`;
    case `psychic`:
      return `Psíquico`;
    case `bug`:
      return `Bicho`;
    case `rock`:
      return `Roca`;
    case `ghost`:
      return `Fantasma`;
    case `dragon`:
      return `Dragón`;
    case `dark`:
      return `Siniestro`;
    case `steel`:
      return `Acero`;
    case `fairy`:
      return `Hada`;
    default:
      return ``; // Si el tipo no está definido, se devuelve vacío
  }
}


// Este fetch se ocupa de coger las stats del pokemon
async function mostrarEstadisticasPokemon(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`No se pudo obtener los datos del Pokémon`);
      }
      return response.json();
    })
    .then(data => {
      const stats = {};
      let totalStats = 0;

      // Iterar sobre las estadísticas del Pokémon
      data.stats.forEach(stat => {
        const statName = stat.stat.name;
        const baseStat = stat.base_stat;
        stats[statName] = baseStat;
        totalStats += baseStat;
      });

      // Mostrar el total de estadísticas
      console.log("Total:", totalStats);

      // Mostrar las estadísticas individuales y animar las barras de progreso
      mostrarBarraDeEstadistica("#hp", stats[`hp`]);
      mostrarBarraDeEstadistica("#ataque", stats[`attack`]);
      mostrarBarraDeEstadistica("#defensa", stats[`defense`]);
      mostrarBarraDeEstadistica("#ataque-especial", stats[`special-attack`]);
      mostrarBarraDeEstadistica("#defensa-especial", stats[`special-defense`]);
      mostrarBarraDeEstadistica("#velocidad", stats[`speed`]);

      // Mostrar el total de estadísticas
      mostrarTotalDeEstadisticas("#total-stats", totalStats);
    })
    .catch(error => {
      console.log(`Error al obtener los datos del Pokémon:`, error);
    });
}

function mostrarBarraDeEstadistica(selector, valor) {
  const progressBar = document.querySelector(selector + " .barra_estadisticas");
  const statValue = document.querySelector(selector + " .valor_estadistica");

  // Configurar el ancho de la barra de progreso
  progressBar.style.width = (valor / 255) * 100 + "%";

  // Mostrar el valor numérico de la estadística
  statValue.textContent = valor;
}

function mostrarTotalDeEstadisticas(selector, total) {
  const totalElement = document.querySelector(selector);
  totalElement.textContent = "Total: " + total;
}

// Obtener otros muchos datos en formato JSON de la PokeAPI de un pokemon
async function obtenerPokemonSpecies(nombrePokemon) {
  return await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nombrePokemon}`)).json();
}

// Obtenemos contenedor de la cadena evolutiva
const contenedorCadenaEv = document.getElementById(`contenido-cadenaEvolutiva`);

// Crea la cadena evolutiva del pokemon
async function crearCadenaEvolutiva(numPokemon) {

  // Obtenemos datos del pokemon donde salga la cadena evolutiva
  const pokemonDatos = await obtenerPokemonSpecies(numPokemon);

  // Obtener datos de la cadena
  const cadenaDatos = await (await fetch(pokemonDatos.evolution_chain.url)).json();


  // Añadir primer pokemon de la cadena

  // Comprobar generación del pokemon
  if (aceptarGeneracion(await obtenerPokemonSpecies(cadenaDatos.chain.species.name))) {
    // Obtener datos del pokemon
    const datosEv1 = await traerPokemon(cadenaDatos.chain.species.name);
    // Añadimos el primer pokemon
    await addPokemonEnCadenaEv(datosEv1);
  }


  // Añadir segunda pokemon de la cadena

  // Comprobar que hay evolución
  if (cadenaDatos.chain.evolves_to !== undefined) {

    // Creamos flecha de evolución
    const flechaEv = document.createElement(`div`);
    flechaEv.classList = `flechaEvolucion`;
    const imgFlecha = document.createElement(`img`);
    imgFlecha.src = `images/flechasevolucion.png`;
    flechaEv.appendChild(imgFlecha);

    // Añadimos al contenedor de la cadena la flecha
    contenedorCadenaEv.appendChild(flechaEv);

    // Datos de los pokemons a los que puede evoluciar a partir de ese
    const datosEvolucion1 = cadenaDatos.chain.evolves_to;


    // Repetir mientras haya pokemons (puede haber varios, como Eevee)
    for (let i = 0; datosEvolucion1[i] !== undefined; i++) {

      const datosGenEv2 = await obtenerPokemonSpecies(datosEvolucion1[i].species.name);
      // Comprobar generación del pokemon
      if (aceptarGeneracion(datosGenEv2)) {
        // Obtener datos del pokemon
        const datosEv2 = await traerPokemon(datosEvolucion1[i].species.name);
        // Añadimos el primer pokemon
        await addPokemonEnCadenaEv(datosEv2);

        // Añadir tercer pokemon de la cadena
        if (datosEvolucion1[i].evolves_to !== undefined) {

          // Creamos flecha de evolución
          const flechaEv2 = document.createElement(`div`);
          flechaEv2.classList = `flechaEvolucion`;
          const imgFlecha2 = document.createElement(`img`);
          imgFlecha2.src = `images/flechasevolucion.png`;
          flechaEv2.appendChild(imgFlecha2);

          // Añadimos al contenedor de la cadena la flecha
          contenedorCadenaEv.appendChild(flechaEv2);

          // Datos de los pokemons a los que puede evoluciar a partir de ese
          const datosEvolucion2 = datosEvolucion1[i].evolves_to;

          // Repetir mientras haya pokemons (puede haber varios, como Eevee)
          for (let i = 0; datosEvolucion2[i] !== undefined; i++) {

            const datosGenEv3 = await obtenerPokemonSpecies(datosEvolucion2[i].species.name);
            // Comprobar generación del pokemon
            if (aceptarGeneracion(datosGenEv3)) {
              // Obtener datos del pokemon
              const datosEv3 = await traerPokemon(datosEvolucion2[i].species.name);
              // Añadimos el primer pokemon
              await addPokemonEnCadenaEv(datosEv3);
            }
          }

        }
      }

    }
  }


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

async function addPokemonEnCadenaEv(datos) {
  // Creamos contenedor del pokemon
  let contenedor = document.createElement(`div`);
  contenedor.className = `elemento-cadena contenedor-elemento elemento-animado`;

  // Calculamos el string adaptado a 3 cifras del número del pokémon
  let numeroPokemon = String(datos.id).padStart(3, `0`);

  // Creamos el enlace clickeable de la imagen
  let urlImagen = document.createElement(`a`);
  // Hacemos que el enlace lleve a la segunda vista
  urlImagen.href = `pokemon.html`;
  // Hacemos que el enlace guarde el número del pokémon para que sepa qué cargar la segunda vista
  urlImagen.addEventListener(`click`, function () {
    guardarNumeroPokemon(datos.id);
  });
  // Creamos la imagen del pokémon
  let imagen = document.createElement(`img`);
  imagen.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${numeroPokemon}.png`;
  // La hacemos clickeable
  urlImagen.appendChild(imagen);
  // Añadir enlace/imagen al elemento
  contenedor.appendChild(urlImagen);


  // Creamos el contenedor del nombre
  let nombre = document.createElement(`div`);
  // Añadimos texto
  nombre.textContent = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
  nombre.classList = `contenedor-nombre`;
  // Lo añadimos 
  contenedor.appendChild(nombre);

  // Creamos el contenedor del número
  let numero = document.createElement(`div`);
  // Añadimos texto
  numero.textContent = `Nº ` + numeroPokemon;
  numero.classList = `contenedor-numero`;
  // Lo añadimos 
  contenedor.appendChild(numero);

  // Creamos el contenedor de los tipos
  let divTipos = document.createElement(`div`);
  divTipos.className = `contenedor-tipos`;

  // Creamos el contenedor del primer tipo
  let divTipo1 = document.createElement(`div`);
  // Creamos el contenedor del texto
  let textoTipo1 = document.createElement(`div`);
  textoTipo1.className = `contenedor-texto-tipo`;
  // Traducimos el primer tipo y lo añadimos al contenedor
  textoTipo1.textContent = traducirTipo(datos.types[0].type.name);
  // Añadimos las clases del contenedor (la segunda sirve para el color de fondo)
  divTipo1.className = `contenedor-tipo ` + textoTipo1.textContent;
  // Añadimos el texto del tipo al contenedor del tipo
  divTipo1.appendChild(textoTipo1);
  // Añadimos el tamaño del contenedor
  divTipo1.width = textoTipo1.width * 3;
  // Añadir contenedor de tipo 1 a Tipos
  divTipos.appendChild(divTipo1);

  // Añadir si tiene segundo tipo
  if (datos.types[1] != null) {
    // Creamos el contenedor del segundo tipo
    let divTipo2 = document.createElement(`div`);
    // Creamos el contenedor del texto
    let textoTipo2 = document.createElement(`div`);
    textoTipo2.className = `contenedor-texto-tipo`;
    // Traducimos el segundo tipo y lo añadimos al contenedor
    textoTipo2.textContent = await traducirTipo(datos.types[1].type.name);
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
  contenedor.appendChild(divTipos);

  // Añadimos el contenedor del pokemon al contenedor de la cadena
  contenedorCadenaEv.appendChild(contenedor);

  elementosAnimados = document.querySelectorAll(`.elemento-animado`); // Actualizar lista para las animaciones

  // Establecer animaciones a los elementos de la lista
  elementosAnimados.forEach(elemento => {
    elemento.addEventListener(`mouseover`, animarFondoTarjeta);
    elemento.addEventListener(`mouseout`, restablecerFondoTarjeta);
  });
}

// Manda al localStorage el número pokémon que cargará en la segunda vista
function guardarNumeroPokemon(num) {
  // Guardar número en localStorage
  localStorage.setItem(`numeroPokemonSeleccionado`, num);
}