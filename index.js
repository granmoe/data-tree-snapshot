const getTestIdTree = (elementOrArray, level = 0) => {
  if (Array.isArray(elementOrArray)) {
    return elementOrArray
      .map(el => getTestIdTree(el, level))
      .filter(Boolean)
      .join('\n')
  }

  const indent = ' '.repeat(level * 2)

  if (elementOrArray.children.length === 0) {
    return `${indent}${elementOrArray.getAttribute('data-testid')}`
  }

  const testId = elementOrArray.getAttribute('data-testid')
  const testIdTree = getTestIdTree(
    [...elementOrArray.children],
    testId ? level + 1 : level,
  )

  if (testIdTree.length === 0) {
    return `${indent}${testId}`
  }

  return testId ? `${indent}${testId}\n${testIdTree}` : testIdTree
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
  } else if (elementOrString instanceof Element) {
    element = elementOrString
  } else {
    throw new TypeError(
      'You must pass either an HTML Element or a string to get-test-id-tree',
    )
  }

  return `\n${getTestIdTree([...element.children])}\n`
}
