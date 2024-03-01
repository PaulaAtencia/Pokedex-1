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
  await ponerTitle(datos);
  await mostrarEstadisticasPokemon(datos.id);
  await crearCadenaEvolutiva(datos.id);
  verificarModo();
});

// Obtener el número del pokemon que se seleccionó antes de entrar a esta vista
async function obtenerNumeroPokemon() {
  return sessionStorage.getItem(`numeroPokemonSeleccionado`);
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
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numeroPokemon}.png`;
  img.id = `pokemonImagen`;

  const div = document.createElement(`div`);
  div.appendChild(img);

  const h3Nombre = document.createElement(`h3`);
  h3Nombre.textContent = `Nombre: ` + corregirNombre(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1));
  div.appendChild(h3Nombre);

  const h3Id = document.createElement(`h3`);
  h3Id.textContent = `Nº: ` + numeroPokemon;
  div.appendChild(h3Id);

  const h3Altura = document.createElement(`h3`);
  h3Altura.textContent = `Altura: ` + (pokemon.height) / 10 + ` m`;
  div.appendChild(h3Altura);


  const h3Peso = document.createElement(`h3`);
  h3Peso.textContent = `Peso: ` + (pokemon.weight) / 10 + ` Kg`;
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

  document.getElementById(`pokemonInfoContainer`).appendChild(div);
}


// Nombra a la página con el nombre del pokémon
async function ponerTitle(pokemon) {
  let nombre = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  nombre = corregirNombre(nombre);
  document.title = nombre;
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
  const totalValue = document.querySelector(selector + " .valor_estadistica");

  // Mostrar el valor numérico de la estadística
  totalValue.textContent = total;
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
  const cadenaEvolutivaDatos = await (await fetch(pokemonDatos.evolution_chain.url)).json();


  // Añadir primer pokemon de la cadena

  const datosGenEv1 = await obtenerPokemonSpecies(await corregirNombre(cadenaEvolutivaDatos.chain.species.name));

  // Comprobar generación del pokemon
  if (aceptarGeneracion(datosGenEv1)) {
    // Añadimos el primer pokemon
    await addPokemonEnCadenaEv(datosGenEv1, contenedorCadenaEv, null);
  }


  // Añadir segunda pokemon de la cadena

  // Comprobar que hay evolución
  if (cadenaEvolutivaDatos.chain.evolves_to.length !== 0) {

    // Datos de los pokemons a los que puede evoluciar a partir de ese
    const datosEvolucion1 = cadenaEvolutivaDatos.chain.evolves_to;

    // Si existen diversas evoluciones, creamos el subconjunto
    let subconjunto = null;
    if (datosEvolucion1.length > 1) {
      subconjunto = document.createElement(`div`);
      subconjunto.id = `contenido-FaseEvolucion`;
      contenedorCadenaEv.appendChild(subconjunto);
    }

    // Repetir mientras haya pokemons (puede haber varios, como Eevee)
    for (let i = 0; i < datosEvolucion1.length; i++) {

      const datosGenEv2 = await obtenerPokemonSpecies(await corregirNombre(datosEvolucion1[i].species.name));
      // Comprobar generación del pokemon
      if (aceptarGeneracion(datosGenEv2)) {

        let filaSubconjunto = null;
        if (subconjunto !== null) {
          filaSubconjunto = document.createElement(`div`);
          filaSubconjunto.classList = `contenido-FilaFaseEv`;
          subconjunto.appendChild(filaSubconjunto);
        }


        let flechaYpokemon = document.createElement(`div`);
        flechaYpokemon.classList = `contenedor-flechaConTarjeta`;
        contenedorCadenaEv.appendChild(flechaYpokemon);

        crearFlechaEvolucion(flechaYpokemon, datosEvolucion1[i].evolution_details);

        // Añadimos el primer pokemon
        await addPokemonEnCadenaEv(datosGenEv2, flechaYpokemon, filaSubconjunto);

        // Añadir tercer pokemon de la cadena
        if (datosEvolucion1[i].evolves_to.length !== 0) {

          // Datos de los pokemons a los que puede evoluciar a partir de ese
          const datosEvolucion2 = datosEvolucion1[i].evolves_to;

          // Repetir mientras haya pokemons (puede haber varios, como Eevee)
          for (let i = 0; i < datosEvolucion2.length; i++) {

            const datosGenEv3 = await obtenerPokemonSpecies(await corregirNombre(datosEvolucion2[i].species.name));

            // Comprobar generación del pokemon
            if (aceptarGeneracion(datosGenEv3)) {

              flechaYpokemon = document.createElement(`div`);
              flechaYpokemon.classList = `contenedor-flechaConTarjeta`;
              contenedorCadenaEv.appendChild(flechaYpokemon);

              crearFlechaEvolucion(flechaYpokemon, datosEvolucion2[i].evolution_details);

              // Añadimos el primer pokemon
              await addPokemonEnCadenaEv(datosGenEv3, flechaYpokemon, filaSubconjunto);
            }
          }
        }
      }
    }
  }
}

// Añade una flecha de paso de evolución
function crearFlechaEvolucion(contenedor, evolucion) {

  // Creamos contenedor de flecha de evolución
  const flechaEv = document.createElement(`div`);
  flechaEv.classList = `flechaEvolucion`;

  // Imagen
  const imgFlecha = document.createElement(`img`);
  imgFlecha.src = `images/flechasevolucion.png`;
  flechaEv.appendChild(imgFlecha);

  // Info del método de evolución
  const info = document.createElement(`div`);
  info.textContent = `INFO`;
  info.classList = `evolucionInfoBoton`;
  // Asignamos el json con la info de la evolución
  info.setAttribute(`data-json`, JSON.stringify(evolucion));
  info.addEventListener(`click`, mostrarInfoEvolucion);
  flechaEv.appendChild(info);

  // Añadimos la flecha delante de la tarjeta
  contenedor.appendChild(flechaEv);
}

// Tarjeta donde aparece la información de la evolución
const contenedorINFOev = document.getElementById(`info-MetodoEvolucion`);

// Muestra la información necesaria sobre cómo realizar esa evolución
function mostrarInfoEvolucion(seleccionado) {

  // JSON con información de como realizar la evolución
  const detallesEv = JSON.parse((seleccionado.currentTarget).getAttribute(`data-json`));

  // Limpiamos el contenedor
  contenedorINFOev.innerHTML = ``;

  // Obtener todos los contenedores extra con la clase específica si los hay
  const contenedoresAEliminar = document.querySelectorAll(`.auxInfo-MetEv`);

  // Iterar sobre los elementos y eliminarlos uno por uno
  contenedoresAEliminar.forEach(function (c) {
    c.remove();
  });

  const listaContINFOev = [contenedorINFOev];

  for (let i = 0; i < detallesEv.length; i++) {

    if (i > 0) {
      listaContINFOev[i] = (document.createElement(`div`));
      listaContINFOev[i].classList = `auxInfo-MetEv`;
      document.getElementById(`contenedor-cadenaEvolutiva`).appendChild(listaContINFOev[i]);
    }

    crearContenedorInfo(traducirInfoEv(detallesEv[i].trigger.name), ``, listaContINFOev[i]);

    crearContenedorInfo(detallesEv[i].min_level, `Debe alcanzar el nivel `, listaContINFOev[i]);

    crearContenedorInfo(detallesEv[i].item, `Item: `, listaContINFOev[i]);

    crearContenedorInfo(detallesEv[i].held_item, `Se debe tener equipado el item: `, listaContINFOev[i]);

    crearContenedorInfo(detallesEv[i].min_happiness, `Debe tener al menos un nivel de amistad de `, listaContINFOev[i]);

    crearContenedorInfo(traducirInfoEv(detallesEv[i].time_of_day), `Debe ser de `, listaContINFOev[i]);

    if (detallesEv[i].location !== null) {
      crearContenedorInfo(traducirInfoEv(detallesEv[i].location.name), `Debes estar en: `, listaContINFOev[i]);
    }
    
    if(detallesEv[i].gender !== null)
    {
      crearContenedorInfo(traducirInfoEv(detallesEv[i].gender), `Debe de ser `, listaContINFOev[i]);
    }
    
    if(detallesEv[i].known_move !== null)
    {
      crearContenedorInfo(traducirInfoEv(detallesEv[i].known_move.name), `Debe aprender el movimiento: `, listaContINFOev[i]);
    }

  }

}

async function crearContenedorInfo(detalle, texto, superContenedor) {
  if (detalle !== null && detalle !== ``) {
    // Contenedor donde va la explicación
    const contenedor = document.createElement(`div`);
    contenedor.classList = `subContenedor-InfoEv`;

    if (texto === `Item: ` || texto === `Se debe tener equipado el item: `) {
      contenedor.textContent = texto + traducirInfoEv(detalle.name);

      const item = await (await fetch(detalle.url)).json();
      console.log(JSON.stringify(item));

      if (item.sprites.default !== null) {
        const sprite = document.createElement(`img`);
        contenedor.appendChild(sprite);
        sprite.src = item.sprites.default;
      }

    }
    else {
      contenedor.textContent = texto + detalle;
    }

    superContenedor.appendChild(contenedor);
  }
}


// Traduce palabras del JSON sobre detalles de evolución
function traducirInfoEv(detalle) {
  switch (detalle) {
    case `level-up`:
      return `Subir de nivel`;
    case `trade`:
      return `Intercambio`;
    case `use-item`:
      return `Usar item`;
    case `shed`:
      return `Se obtiene como extra al evolucionar Nincada a Ninjask`;
    case `day`:
      return `día`;
    case `night`:
      return `noche`;
    case `eterna-forest`:
      return `Bosque Vetusto`;
    case `sinnoh-route-217`:
      return `Ruta 217 de Sinnoh`;
    case `twist-mountain`:
      return `Monte Tuerca`;
    case `frost-cavern`:
      return `Gruta Helada`;
    case `pinwheel-forest`:
      return `Bosque Azulejo`;
    case `kalos-route-20`:
      return `Ruta 20 de Kalos`;
    case `water-stone`:
      return `Piedra Agua`;
    case `thunder-stone`:
      return `Piedra Trueno`;
    case `fire-stone`:
      return `Piedra Fuego`;
    case `moon-stone`:
      return `Piedra Lunar`;
    case `sun-stone`:
      return `Piedra Solar`;
    case `kings-rock`:
      return `Piedra Rey`;
    case `metal-coat`:
      return `Piedra Noche`;
    case `upgrade`:
      return `Objeto Mejora`;
    case `leaf-stone`:
      return `Piedra Hoja`;
    case `shiny-stone`:
      return `Piedra Alba`;
    case `dusk-stone`:
      return `Piedra Amanecer`;
    case `dawn-stone`:
      return `Piedra Agudo`;
    case `oval-stone`:
      return `Piedra Oval`;
    case `dubious-disc`:
      return `Piedra Peso`;
    case `ice-stone`:
      return `Piedra Hielo`;
    case `up-grade`:
      return `Mejora`;
    case `razor-claw`:
      return `Garra Afilada`;
    case `ancient-power`:
      return `Poder Pasado`;
    case 1:
      return `hembra`;
    default:
      return ``;
  }
}

// Crear la tarjeta de un pokemon entera y añadirla al contenedor
async function addPokemonEnCadenaEv(datos, contenedorSuperior, contenedorFila) {

  // Obtenemos el contenedor que contiene varios pokemon de una fase evolutiva
  const contenedorSubconjunto = document.getElementById(`contenido-FaseEvolucion`);

  if (contenedorSubconjunto !== null) {
    contenedorFila.appendChild(contenedorSuperior);
  }

  // Creamos contenedor del pokemon
  let tarjeta = document.createElement(`div`);
  tarjeta.className = `elemento-cadena contenedor-elemento elemento-animado`;

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
  tarjeta.appendChild(urlImagen);


  // Creamos el contenedor del nombre
  let nombre = document.createElement(`div`);
  // Añadimos texto
  nombre.textContent = datos.name.charAt(0).toUpperCase() + datos.name.slice(1);
  nombre.classList = `contenedor-nombre`;
  // Lo añadimos 
  tarjeta.appendChild(nombre);

  // Creamos el contenedor del número
  let numero = document.createElement(`div`);
  // Añadimos texto
  numero.textContent = `Nº ` + numeroPokemon;
  numero.classList = `contenedor-numero`;
  // Lo añadimos 
  tarjeta.appendChild(numero);

  if(nombre.textContent === document.title)
  {
    nombre.id=`PokemonSeleccionado`;
    numero.id=`PokemonSeleccionadoNumero`;
  }


  // Obtenemos los datos de la API donde salen los tipos
  const datosTipos = await traerPokemon(datos.id);

  // Creamos el contenedor de los tipos
  let divTipos = document.createElement(`div`);
  divTipos.className = `contenedor-tipos`;

  // Creamos el contenedor del primer tipo
  let divTipo1 = document.createElement(`div`);
  // Creamos el contenedor del texto
  let textoTipo1 = document.createElement(`div`);
  textoTipo1.className = `contenedor-texto-tipo`;
  // Traducimos el primer tipo y lo añadimos al contenedor
  textoTipo1.textContent = traducirTipo(datosTipos.types[0].type.name);
  // Añadimos las clases del contenedor (la segunda sirve para el color de fondo)
  divTipo1.className = `contenedor-tipo ` + textoTipo1.textContent;
  // Añadimos el texto del tipo al contenedor del tipo
  divTipo1.appendChild(textoTipo1);
  // Añadimos el tamaño del contenedor
  divTipo1.width = textoTipo1.width * 3;
  // Añadir contenedor de tipo 1 a Tipos
  divTipos.appendChild(divTipo1);
  // Añadir tipo 1 a las clase del elemento
  tarjeta.classList.add(textoTipo1.textContent + `t1`);
  // Añadimos tipo 2 a las clase del elemento como si fuera nulo (por si no tiene)
  tarjeta.classList.add(`nullt2`);

  // Añadir si tiene segundo tipo
  if (datosTipos.types[1] != null) {
    // Creamos el contenedor del segundo tipo
    let divTipo2 = document.createElement(`div`);
    // Creamos el contenedor del texto
    let textoTipo2 = document.createElement(`div`);
    textoTipo2.className = `contenedor-texto-tipo`;
    // Traducimos el segundo tipo y lo añadimos al contenedor
    textoTipo2.textContent = await traducirTipo(datosTipos.types[1].type.name);
    // Añadimos las clases del contenedor (la segunda sirve para el color de fondo)
    divTipo2.className = `contenedor-tipo ` + textoTipo2.textContent;
    // Añadimos el texto del tipo al contenedor del tipo
    divTipo2.appendChild(textoTipo2);
    // Añadimos el tamaño del contenedor
    divTipo2.width = textoTipo2.width * 3;
    // Añadir contenedor de tipo 2 a Tipos
    divTipos.appendChild(divTipo2);
    // Añadir tipo 2 a las clase del elemento
    tarjeta.classList.add(textoTipo2.textContent + `t2`);
  }

  // Añadir contenedor de los tipos al elemento
  tarjeta.appendChild(divTipos);

  // Añadir tarjeta al contenedor
  contenedorSuperior.appendChild(tarjeta);

  // Actualizar lista para las animaciones
  elementosAnimados = document.querySelectorAll(`.elemento-animado`);

  // Establecer animaciones a los elementos de la lista
  elementosAnimados.forEach(elemento => {
    elemento.addEventListener(`mouseover`, animarFondoTarjeta);
    elemento.addEventListener(`mouseout`, restablecerFondoTarjeta);
  });
}