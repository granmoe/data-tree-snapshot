const ensureCompactArray = arr => (arr.length === 1 ? arr[0] : arr)

const getTestIdTree = elementOrArray => {
  if (Array.isArray(elementOrArray)) {
    return ensureCompactArray(elementOrArray.map(getTestIdTree).filter(Boolean))
  }

  if (elementOrArray.children.length === 0) {
    return elementOrArray.getAttribute('data-testid')
  }

  const testId = elementOrArray.getAttribute('data-testid')
  const testIdTreeArray = [...elementOrArray.children]
    .map(getTestIdTree)
    .filter(Boolean)

  if (testIdTreeArray.length === 0) {
    return testId
  }

  // Remove extra array wrappers
  const compactedTestIdTreeArray = ensureCompactArray(testIdTreeArray)

  return testId
    ? { [testId]: compactedTestIdTreeArray }
    : compactedTestIdTreeArray
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

  const testIdTree = getTestIdTree([...element.children])
  // Maybe strip surrounding [] if always returned

  const testIdTreeJsonString = JSON.stringify(testIdTree, null, 2)
    .replace(
      /[",]/g, // TODO: Is it valid to use a comma in an HTML attribute string?
      '',
    )
    .replace(/[{}[\]]/g, '') // FIXME: Maybe remove this...need to see if results are more readable
    .replace(/(\n(\s*)){2,}/g, '\n$2') // FIXME: Get this working
  // Also, find a way to fix testid1: testid2...should be a newline for every nested level

  // TODO: Remove colons and somehow fix extra indents

  return ['{', '['].includes(testIdTreeJsonString.charAt(0))
    ? testIdTreeJsonString.slice(1, testIdTreeJsonString.length - 1)
    : testIdTreeJsonString
}

// FIXME: Some way to pass querySelector
