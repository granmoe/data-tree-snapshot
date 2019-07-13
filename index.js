const makeGetAttributeTree = ({
  attributeName,
  propertyName,
  format = a => a,
  filter,
}) => {
  const getAttributeTree = (elementOrArray, level = 0) => {
    if (Array.isArray(elementOrArray)) {
      return elementOrArray
        .map(el => getAttributeTree(el, level))
        .filter(Boolean)
        .join('\n')
    }

    const indent = ' '.repeat(level * 2)

    // prettier-ignore
    const nodeData = attributeName
      ? elementOrArray.getAttribute(attributeName)
      : propertyName === 'textContent' // TODO: similar handling for innerText, innerHTML?
        ? elementOrArray.childNodes[0].nodeValue
        : elementOrArray[propertyName]

    const isValidNodeData = filter ? filter(nodeData) : true

    if (elementOrArray.children.length === 0) {
      return isValidNodeData ? `${indent}${format(nodeData)}` : null
    }

    const attributeTree = getAttributeTree(
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

  return getAttributeTree
}

export default ({ format, filter, attributeName, propertyName }) => {
  // TODO: Check for either p or a (a ^ p) and validate p similar to a
  // if (!(typeof attributeName === 'string' && attributeName.length > 0)) {
  //   throw new Error('attributeName must be a non-empty string')
  // }

  const getAttributeTree = makeGetAttributeTree({
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
        'You must pass either an HTML Element or a string to get-test-id-tree',
      )
    }

    return `\n${getAttributeTree([...element.children])}\n` // Surround with newlines for nice formatting in jest snapshots and so that horizontal lines in editor line up perfectly in snapshot
  }
}
