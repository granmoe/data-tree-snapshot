const makeGetDataTree = ({
  attributeName,
  propertyName,
  format = a => a,
  filter,
}) => {
  const getDataTree = (elementOrArray, level = 0) => {
    if (Array.isArray(elementOrArray)) {
      return elementOrArray
        .map(el => getDataTree(el, level))
        .filter(Boolean)
        .join('\n')
    }

    const indent = ' '.repeat(level * 2)

    // prettier-ignore
    const nodeData = attributeName
      ? elementOrArray.getAttribute(attributeName)
      : propertyName === 'textContent' // TODO: similar handling for innerText?
        ? elementOrArray.childNodes.length && elementOrArray.childNodes[0].nodeValue
        : elementOrArray[propertyName]

    const isValidNodeData = filter ? filter(nodeData, elementOrArray) : true

    if (elementOrArray.children.length === 0) {
      return isValidNodeData ? `${indent}${format(nodeData)}` : null
    }

    const attributeTree = getDataTree(
      [...elementOrArray.children],
      isValidNodeData ? level + 1 : level,
    )

    if (attributeTree.length === 0) {
      return isValidNodeData ? `${indent}${format(nodeData)}` : null
    }

    return isValidNodeData
      ? `${indent}${format(nodeData)}\n${attributeTree}`
      : attributeTree
  }

  return getDataTree
}

export default ({ format, filter, attributeName, propertyName }) => {
  if (!(Boolean(attributeName) ^ Boolean(propertyName))) {
    throw new ReferenceError(
      'You must pass either an attributeName or propertyName option to makeGetDataTree (and only one or the other)',
    )
  }

  if (attributeName) {
    if (!(typeof attributeName === 'string' && attributeName.length > 0)) {
      throw new Error('attributeName must be a non-empty string')
    }
  } else if (!(typeof propertyName === 'string' && propertyName.length > 0)) {
    throw new Error('propertyName must be a non-empty string')
  }

  if (format !== undefined && typeof format !== 'function') {
    throw new ReferenceError('The format option must be a function')
  }

  if (filter !== undefined && typeof filter !== 'function') {
    throw new ReferenceError('The filter option must be a function')
  }

  const getDataTree = makeGetDataTree({
    attributeName,
    propertyName,
    format,
    filter,
  })

  return elementOrString => {
    let element
    if (typeof elementOrString === 'string') {
      element = document.querySelector(
        `[${attributeName}="${elementOrString}"]`,
      )

      if (element === null) {
        throw new ReferenceError(
          `No element found for ${attributeName}: ${elementOrString}`,
        )
      }
    } else if (elementOrString instanceof Element) {
      element = elementOrString
    } else {
      throw new TypeError(
        'You must pass either an HTML Element or a string to makeGetDataTree',
      )
    }

    return `\n${getDataTree([...element.children])}\n` // Surround with newlines for nice formatting in jest snapshots and so that horizontal lines in editor line up perfectly in snapshot
  }
}
