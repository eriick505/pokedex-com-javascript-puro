const pokemonTypesAsArray = ({ types }) => types.map(({ type }) => type.name)

const createElement = (elementName, attributes) => {
  const element = document.createElement(elementName)
  const attributeAsArray = Object.entries(attributes)

  attributeAsArray.forEach(([key, value]) => element.setAttribute(key, value))

  return element;
}

export { pokemonTypesAsArray, createElement }