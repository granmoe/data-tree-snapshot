const getTestIdTree = (elementOrArray, level = 0) => {
  if (Array.isArray(elementOrArray)) {
    return elementOrArray
      .map(el => getTestIdTree(el, level))
      .filter(Boolean)
      .join('\n')
  }

  const indent = ' '.repeat(level * 2)

  if (elementOrArray.children.length === 0) {
    return `${indent}${level}-${elementOrArray.getAttribute('data-testid')}`
  }

  const testId = elementOrArray.getAttribute('data-testid')
  const testIdTree = getTestIdTree([...elementOrArray.children], level + 1)

  if (testIdTree.length === 0) {
    return `${indent}${level}-${testId}`
  }

  return testId ? `${indent}${level}${testId}\n${testIdTree}` : testIdTree
}

export default elementOrString => {
  let element
  if (typeof elementOrString === 'string') {
    element = document.querySelector(`[data-testid="${elementOrString}"]`)

    if (element === null) {
      throw new ReferenceError(
        `No element found for data-testid: ${elementOrString}`,
      )
    }
  } else {
    // TODO: throw when not element
    element = elementOrString
  }

  // TODO: Walk lines in printout and collapse levels

  const testIdTree = getTestIdTree([...element.children])

  console.log(testIdTree)

  return testIdTree
}
