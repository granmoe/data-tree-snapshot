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

export default element =>
  JSON.stringify(getTestIdTree([...element.children]), null, 2).replace(
    /"/g,
    "'",
  )
