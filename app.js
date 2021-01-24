const searchInput = document.querySelector('#search')
const pokedex = document.querySelector('[data-js="pokedex"]')
const searchContainer = document.querySelector('.searchContainer')
const popup = document.querySelector('.popup')
const popupCloseBtn = document.querySelector('.popup__close')

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

const activeSearchContainerSticky = () => {
  const { scrollTop } = document.documentElement
  const isTopGreaterThanZero = scrollTop >= 210

  if(isTopGreaterThanZero) {
    searchContainer.classList.add('active')
    return
  }

  searchContainer.classList.remove('active')
}

const removeNumberAndDots = string => string.replace(/[0-9]/g, '').replace('. ', '')

const getSearchInputValue = element => element.target.value.toLowerCase();

const pokemonFilter = event => {
  const inputValue = getSearchInputValue(event)
  const cards = document.querySelectorAll('.card')

  cards.forEach(card => {
    const h2 = card.querySelector('h2').textContent.toLowerCase()
    const h2WithoutNumbersAndDots = removeNumberAndDots(h2)

    if(h2WithoutNumbersAndDots.includes(inputValue)){
      card.style = "display: block"
      return
    }
    card.style = "display: none"
  })
}

const openPopup = () => popup.style.display = 'block'

const closePopup = event => {
  const isElementHasClasses = ['popup', 'popup__close'] 
  const elementClassTarget = event.target.getAttribute('class')

  isElementHasClasses.map(item => {
    if(elementClassTarget === item) {
      popup.style.display = 'none'
      return
    }
  })
}

const fetchPokemonInfo = async id => {
  openPopup()
}

popup.addEventListener('click', closePopup)
searchInput.addEventListener('input', pokemonFilter)
window.addEventListener('scroll', activeSearchContainerSticky)