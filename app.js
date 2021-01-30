import { createPopupHeader, createPopupBody } from './js/popup.js'
import { pokemonTypesAsArray } from './js/utils.js'

const searchInput = document.querySelector('#search')
const pokedex = document.querySelector('[data-js="pokedex"]')
const searchContainer = document.querySelector('.searchContainer')
const popup = document.querySelector('.popup')
const popUpBox = document.querySelector('.popup__box')
const popupContent = document.querySelector('.popup__content');

const API = 'https://pokeapi.co/api/v2/pokemon'

const fetchPokemonPromises = () => Array(151).fill().map((_, index) => 
  fetch(`${API}/${index + 1}`)
  .then(response => response.json()));

Promise.all(fetchPokemonPromises())
  .then(pokemons => listPokemonTemplateHTML(pokemons))
  .then(listPokemons => insertPokemonsIntoDOM(listPokemons))

const listPokemonTemplateHTML = pokemons => {
  return pokemons.reduce((accumulator, pokemon) => {
    const { id, name } = pokemon
    const typesInfo = pokemonTypesAsArray(pokemon)

    accumulator += `
      <li class="card ${typesInfo[0]}" onclick="fetchPokemonInfo(${id})">
        <img class="card-image" src="${getPokemonImageByID(id)}" alt="${name}" />
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${typesInfo.join(' | ')}</p>
      </li>
    `
    return accumulator;
  }, '')
}

const getPokemonImageByID = ID => `https://pokeres.bastionbot.org/images/pokemon/${ID}.png`

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

const pokemonFilter = event => {
  const inputValue = event.target.value.toLowerCase();
  const cards = document.querySelectorAll('.card')

  cards.forEach(card => {
    const h2 = card.querySelector('h2').textContent.toLowerCase()
    const h2WithoutNumbersAndDots = removeNumberAndDots(h2)

    if(h2WithoutNumbersAndDots.includes(inputValue)){
      card.style = "display: block;"
      return
    }
    card.style = "display: none"
  })
}

const fetchPokemonInfo = async id => {
  const response = await fetch(`${API}/${id}`)
  const pokemon = await response.json();

  handleWithPopupInfo(pokemon)
}
// TEMPORARY SOLUTION (Necessary refractory for addEventListener)
window.fetchPokemonInfo = fetchPokemonInfo

const openPopup = () => {
  popUpBox.classList.add('animateSlideDown')
  popup.style.display = 'block'
}

const clearPopup = () => {
  const classesPopupBox = popUpBox.classList
  const classesPopupBoxAsArray = [ ...classesPopupBox ]
  classesPopupBoxAsArray.filter(item => item !== 'popup__box' ? classesPopupBox.remove(item) : '')

  popupContent.innerHTML = ''
}

const closePopup = event => {
  const isElementHasClasses = ['popup', 'popup__close'] 
  const elementClassTarget = event.target.getAttribute('class')

  isElementHasClasses.map(item => {
    if(elementClassTarget === item) {
      popup.style.display = 'none'
      clearPopup()
      return
    }
  })
}

const handleWithPopupInfo = pokemon => {
  const typesInfo = pokemonTypesAsArray(pokemon)
  const popupHeader = createPopupHeader(pokemon)
  const popupBody = createPopupBody(pokemon)

  popupContent.appendChild(popupHeader)
  popupContent.appendChild(popupBody)

  popUpBox.classList.add(typesInfo[0])

  openPopup()
}

popup.addEventListener('click', closePopup)
searchInput.addEventListener('input', pokemonFilter)
window.addEventListener('scroll', activeSearchContainerSticky)
