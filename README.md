# Data Tree Snapshot 🌳🤳

## Intro

Create the smallest possible representation of the tree structure of the values of any attribute or property contained in a DOM element. `get-attribute-tree` only preserves ancestor/descendant relationships because it is used to assert that a given element _contains_ a certain structure. This compacted tree structure is created recursively for the entire DOM tree within the given DOM element.

## Installation

```
npm install data-tree-snapshot -D
```

## Examples / Cool Things You Can Do With This

### Text Snapshotting

```js
test('has correct textContent', () => {
  const { container } = render(
    <div>
      Heading
      <div>
        Subheading
        <div>Paragraph 1</div>
        <div>Paragraph 2</div>
        <div>Paragraph 3</div>
      </div>
    </div>,
  )

  const getTextContentTree = makeGetAttributeTree({
    propertyName: 'textContent',
    filter: t => typeof t === 'string' && t.length > 0,
  })

  const tree = getTextContentTree(container)

  expect(tree).toMatchInlineSnapshot(`
    "
    Heading
      Subheading
        Paragraph 1
        Paragraph 2
        Paragraph 3
    "
  `)
})
```

#### Implementation

```js
import makePrintDataTree from '../make-print-data-tree'

export default makePrintDataTree({
  propertyName: 'textContent',
  filter: t => typeof t === 'string' && t.length > 0,
})
```

### Test Id Tree Snapshotting

```js
import React from 'react'
import { render } from '@testing-library/react'
import { getTestIdTree } from 'data-tree-snapshot' // TODO: Implement this and export it

test('example from the README', () => {
  render(
    <div data-testid="root">
      <div>
        <div data-testid="parent">
          <div data-testid="child">
            <div>
              <div>
                <span data-testid="deeply-nested-child">some stuff</span>
              </div>
            </div>
          </div>
          <br data-testid="another-child" />
          <div>
            <br data-testid="yet-another-child" />
          </div>
        </div>
      </div>
    </div>,
  )

  // 👇 You can pass either a data-testid string or an element itself
  expect(getTestIdTree('root')).toMatchInlineSnapshot(`
    "
    parent
      child
        deeply-nested-child
      another-child
      yet-another-child
    "
  `)
})
```

(Lots more good info about this helper [on the wiki page!](https://github.com/granmoe/data-tree-snapshot/wiki/printTestIdTree))

#### Implementation

```js
import makePrintDataTree from '../make-print-data-tree'

// If you use an attribute, the default string selector will be for that attribute
// e.g. document.querySelector('[data-testid="your-test-id-name"]') will be used for printTestIdTree
export default makePrintDataTree({
  attributeName: 'data-testid',
  filter: t => typeof t === 'string' && t.length > 0,
})
```

## Upcoming Features

- Include multiple pieces of data per element
- Configure selectors for property printers
