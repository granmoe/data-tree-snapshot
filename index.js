const getTestIdTree = (elementOrArray, level = 0) => {
  if (Array.isArray(elementOrArray)) {
    return elementOrArray
      .map(el => getTestIdTree(el, level))
      .filter(Boolean)
      .join('\n')
  }

  const indent = ' '.repeat(level * 2)

  const testId = elementOrArray.getAttribute('data-testid')
  const isValidTestId = typeof testId === 'string' && testId.length > 0

  if (elementOrArray.children.length === 0) {
    return isValidTestId ? `${indent}${testId}` : null
  }

  const testIdTree = getTestIdTree(
    [...elementOrArray.children],
    isValidTestId ? level + 1 : level,
  )

  if (testIdTree.length === 0) {
    return isValidTestId ? `${indent}${testId}` : null
  }

  return isValidTestId ? `${indent}${testId}\n${testIdTree}` : testIdTree
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

  return `\n${getTestIdTree([...element.children])}\n` // Surround with newlines for nice formatting in jest snapshots and so that horizontal lines in editor line up perfectly in snapshot
}
