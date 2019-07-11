const getTestIdTree = (elementOrArray, level = 0) => {
  if (Array.isArray(elementOrArray)) {
    return elementOrArray
      .map(el => getTestIdTree(el, level))
      .filter(Boolean)
      .join('\n')
  }

  const indent = ' '.repeat(level * 2)

  if (elementOrArray.children.length === 0) {
    // return elementOrArray.getAttribute('data-testid')
    return `${indent}${level}-${elementOrArray.getAttribute('data-testid')}`
  }

  const testId = elementOrArray.getAttribute('data-testid')
  const testIdTree = getTestIdTree([...elementOrArray.children], level + 1)
  // const testIdTreeArray = [...elementOrArray.children]
  //   .map(el => getTestIdTree(el, level + 1))
  //   .filter(Boolean)

  if (testIdTree.length === 0) {
    return `${indent}${level}-${testId}`
  }

  // Remove extra array wrappers
  // const compactedTestIdTreeArray = ensureCompactArray(testIdTreeArray)

  // return testId
  //   ? { [testId]: compactedTestIdTreeArray }
  //   : compactedTestIdTreeArray

  // return testId ? { [`${level}-${testId}`]: testIdTreeArray } : testIdTreeArray
  return testId
    ? `${indent}${level}-OBJ-${testId}\n${indent + '  '}${testIdTree}`
    : testIdTree
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

  console.log(testIdTree)

  return testIdTree

  /*
    const testIdTreeJsonString = JSON.stringify(testIdTree, null, 2)

    const trimmed = ['{', '['].includes(testIdTreeJsonString.charAt(0))
      ? testIdTreeJsonString.slice(1, testIdTreeJsonString.length - 1)
      : testIdTreeJsonString
    console.log(trimmed)

    const result = trimmed
      .replace(
        /[",:]/g, // TODO: Make sure none of these can be validly used inside an HTML attr
        '',
      )
      .replace(/\s*[}\]]/g, '')
      .replace(/\s*[[{]/g, '')

    console.log(result)
    return result
  */
}

// TODO:
// Remove object wrappers after stringifying and just unindent once via regex magic
// (remove two spaces and make sure outermost doesn't throw)

// FIXME: Some way to pass querySelector
