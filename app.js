const pokedex = document.querySelector('[data-js="pokedex"]')

const API = 'https://pokeapi.co/api/v2/pokemon'

const fetchPokemonPromises = () => Array(151).fill().map((_, index) => 
  fetch(`${API}/${index + 1}`)
  .then(response => response.json()));

Promise.all(fetchPokemonPromises())
  .then(pokemons => listPokemonTemplateHTML(pokemons))
  .then(listPokemons => insertPokemonsIntoDOM(listPokemons))

const listPokemonTemplateHTML = pokemons => {
  return pokemons.reduce((accumulator, { id, name, types }) => {
    const typesInfo = types.map(({ type }) => type.name)

    accumulator += `
      <li class="card ${typesInfo[0]}" onClick="fetchPokemonInfo(${id})">
        <img class="card-image" src="https://pokeres.bastionbot.org/images/pokemon/${id}.png" alt="${name}" />
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${typesInfo.join(' | ')}</p>
      </li>
    `
    return accumulator;
  }, '')
}

const insertPokemonsIntoDOM = pokemons => {
  pokedex.innerHTML = pokemons;
}

const getPokemonInfo = pokemon => {
  console.log(pokemon );
}

const fetchPokemonInfo = async id => {
  const response = await fetch(`${API}/${id}`)
  const data = await response.json()

  getPokemonInfo(data)
}

