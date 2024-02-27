          const statTranslations = {
            'hp': 'Puntos de Salud',
            'attack': 'Ataque',
            'defense': 'Defensa',
            'special-attack': 'Ataque Especial',
            'special-defense': 'Defensa Especial',
            'speed': 'Velocidad'
          };
          
           

              async function traerPokemon() {
                try {
                  const response = await fetch('https://pokeapi.co/api/v2/pokemon/33');
                  if (!response.ok) {
                    throw new Error('No se pudo obtener los datos de la PokeAPI');
                  }
                  const data = await response.json();
                  crearPokemon(data);
                } catch (error) {
                  console.error('Error al obtener los datos:', error);
                }
              }
              
              function crearPokemon(pokemon){
                const img = document.createElement('img');
                img.src = pokemon.sprites.other.home.front_default;
              
                const div = document.createElement('div');
                div.appendChild(img);
              
                const h3Nombre = document.createElement('h3');
                h3Nombre.textContent = 'Nombre: ' + pokemon.name;
                div.appendChild(h3Nombre);
              
                const h3Id = document.createElement('h3');
                h3Id.textContent = 'ID: ' + pokemon.id;
                div.appendChild(h3Id);
              
                const h3Altura = document.createElement('h3');
                h3Altura.textContent = 'Altura: ' + pokemon.height;
                div.appendChild(h3Altura);
              

                const h3Peso = document.createElement('h3');
                h3Peso.textContent = 'Peso: ' + pokemon.weight;
                div.appendChild(h3Peso);
              

                const h3Types = document.createElement('h3');
                h3Types.textContent = 'Tipos: ';
                pokemon.types.forEach(type => {
                  const spanType = document.createElement('span');
                  const tipoTraducido = traducirTipo(type.type.name);
                  spanType.textContent = tipoTraducido;
                  h3Types.appendChild(spanType);
                  h3Types.appendChild(document.createTextNode(', ')); // Separador
                });
                // Eliminar la última coma y espacio
                h3Types.textContent = h3Types.textContent.slice(0, -2);
                div.appendChild(h3Types);
              
                document.getElementById('pokemonContainer').appendChild(div);
              }
              
              traerPokemon();
              function traducirTipo(tipo) {
                switch (tipo) {
                  case 'normal':
                    return 'Normal';
                  case 'fire':
                    return 'Fuego';
                  case 'water':
                    return 'Agua';
                  case 'electric':
                    return 'Eléctrico';
                  case 'grass':
                    return 'Planta';
                  case 'ice':
                    return 'Hielo';
                  case 'fighting':
                    return 'Lucha';
                  case 'poison':
                    return 'Veneno';
                  case 'ground':
                    return 'Tierra';
                  case 'flying':
                    return 'Volador';
                  case 'psychic':
                    return 'Psíquico';
                  case 'bug':
                    return 'Bicho';
                  case 'rock':
                    return 'Roca';
                  case 'ghost':
                    return 'Fantasma';
                  case 'dragon':
                    return 'Dragón';
                  case 'dark':
                    return 'Siniestro';
                  case 'steel':
                    return 'Acero';
                  case 'fairy':
                    return 'Hada';
                  default:
                    return tipo; // Si el tipo no está definido, se devuelve tal cual
                }
              }

          const pokemonContenedor = document.querySelector(".pokemon-container");
//este fetch se ocupa de pillar las stats del pokemon
function mostrarEstadisticasPokemon(pokemonId) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('No se pudo obtener los datos del Pokémon');
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
          mostrarBarraDeEstadistica("#hp", stats['hp']);
          mostrarBarraDeEstadistica("#ataque", stats['attack']);
          mostrarBarraDeEstadistica("#defensa", stats['defense']);
          mostrarBarraDeEstadistica("#ataque-especial", stats['special-attack']);
          mostrarBarraDeEstadistica("#defensa-especial", stats['special-defense']);
          mostrarBarraDeEstadistica("#velocidad", stats['speed']);

          // Mostrar el total de estadísticas
          mostrarTotalDeEstadisticas("#total-stats", totalStats);
      })
      .catch(error => {
          console.log('Error al obtener los datos del Pokémon:', error);
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

// Ejemplo de uso: mostrar las estadísticas del Pokémon con ID 5
mostrarEstadisticasPokemon(33);

    
          document.addEventListener("DOMContentLoaded", function() {
            const temaPersiste = localStorage.getItem('tema');
            let dark = temaPersiste === 'dark'; // Variable para controlar el estado del modo oscuro
      
            // Función para activar el modo oscuro
            function activaModoOscuro() {
              document.body.style.backgroundColor = 'darkgrey';
              const ctema = document.getElementById('tema');
              ctema.style.color = 'black';
              dark = true;
              localStorage.setItem('tema', 'dark');
            }
      
            // Función para quitar el modo oscuro
            function quitarModoOscuro() {
              document.body.style.backgroundColor = 'white';
              const ctema = document.getElementById('tema');
              ctema.style.color = 'black'; // Puedes ajustar el color según lo prefieras
              dark = false;
              localStorage.setItem('tema', 'light');
            }
      
            // Función para cambiar entre el modo oscuro y el modo claro
            function toggleModo() {
              if (dark) {
                quitarModoOscuro();
              } else {
                activaModoOscuro();
              }
            }
      
            // Agregar un event listener al elemento con id "tema"
            const ctema = document.getElementById('tema');
            ctema.addEventListener("click", toggleModo);
      
            // Aplicar el tema al cargar la página
            if (temaPersiste === 'dark') {
              activaModoOscuro();
            }
          });




          