import { pokemonTypesAsArray, createElement } from './utils.js'

const createPopupHeader = pokemon => {
  const typesLi = pokemonTypesAsArray(pokemon).reduce((acc, item) => {
    acc += `<li>${item}</li>`
    return acc;
  }, '');

  const popUpHeader = createElement('div', {
    class: 'popup__header'
  })

  const templateHeader = `
    <h2>${pokemon.name}</h2>
    <span class="pokeId">#${pokemon.id}</span>
    <ul class="types">
      ${typesLi}
    </ul>
    <img 
      src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" 
      alt="${pokemon.name}">
  `
  popUpHeader.innerHTML = templateHeader

  return popUpHeader
}

const createPopupBody = pokemon => {
  const popUpBody = createElement('div', {
    class: 'popup__body'
  })

  const getStats = pokemon.stats.map(({ base_stat, stat: {name} }) => {
    const resumeName = name.replace('special', 'sp')

    return `
      <tr>
        <td>${resumeName}</td> 
        <td>${base_stat}</td>
        <td>
          <div class="skillbar">
            <span class="bar ${name}" style="width: calc(100% * ${base_stat}/255)"></span>
          </div>
        </td>
      </tr>
    `
  }).join('')

  const getTotal = pokemon.stats.map(({ base_stat }) => base_stat)
    .reduce((acc, item) =>  acc + item , 0)

  const templateBody = `
    <ul class="menu">
      <li class="active">Stats</li>
      <li>Moves</li>
      <li>Evolutions</li>
    </ul>

    <div class="tables">
      <table>
        <tbody>
          ${getStats}
          <tr>
            <td>TOTAL</td>
            <td>${getTotal}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  `
  popUpBody.innerHTML = templateBody

  return popUpBody
}

export { createPopupHeader, createPopupBody };