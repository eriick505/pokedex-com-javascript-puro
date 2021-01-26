const searchInput = document.querySelector('#search')
const pokedex = document.querySelector('[data-js="pokedex"]')
const searchContainer = document.querySelector('.searchContainer')
const popup = document.querySelector('.popup')
const popUpBox = document.querySelector('.popup__box')
const popupCloseBtn = document.querySelector('.popup__close')
const popupContent = document.querySelector('.popup__content');

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

const fetchPokemonInfo = async id => {
  const response = await fetch(`${API}/${id}`)
  const pokemon = await response.json();

  handleWithPopupInfo(pokemon)
}

const openPopup = () => popup.style.display = 'block'

const closePopup = event => {
  const isElementHasClasses = ['popup', 'popup__close'] 
  const elementClassTarget = event.target.getAttribute('class')
  const typePokemonClass = popUpBox.classList.item(1)

  isElementHasClasses.map(item => {
    if(elementClassTarget === item) {
      popup.style.display = 'none'
      popupContent.innerHTML = ''
      popUpBox.classList.remove(typePokemonClass)
      return
    }
  })
}

const createElement = (elementName, attributes) => {
  const element = document.createElement(elementName)
  const attributeAsArray = Object.entries(attributes)

  attributeAsArray.forEach(([key, value]) => element.setAttribute(key, value))

  return element;
}

const handleWithPopupInfo = pokemon => {
  const typesInfo = pokemon.types.map(({ type }) => type.name)

  const typesLi = typesInfo.reduce((acc, item) => {
    acc += `<li>${item}</li>`
    return acc;
  }, '');
  
  const popUpHeader = createElement('div', {
    class: 'popup__header'
  })

  const popUpBody = createElement('div', {
    class: 'popup__body'
  })

  const popUpHeaderTemplate = `
    <h2>${pokemon.name}</h2>
    <ul class="types">
      ${typesLi}
    </ul>
    <img 
      src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" 
      alt="${pokemon.name}">
  `
  const popUpBodyTemplate = `
    <ul class="menu">
      <li class="active">About</li>
      <li>Moves</li>
      <li>Evolutions</li>
    </ul>

    <div class="tables">
      <table>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>marks</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
  popUpHeader.innerHTML = popUpHeaderTemplate
  popUpBody.innerHTML = popUpBodyTemplate

  popupContent.appendChild(popUpHeader)
  popupContent.appendChild(popUpBody)

  popUpBox.classList.add(typesInfo[0])
  openPopup()
}

popup.addEventListener('click', closePopup)
searchInput.addEventListener('input', pokemonFilter)
window.addEventListener('scroll', activeSearchContainerSticky)