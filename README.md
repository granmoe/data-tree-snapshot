# Data Tree Snapshot 🌳🤳

## Intro

Create the smallest possible representation of the tree structure of the values of any attribute or property contained in a DOM element. `data-tree-snapshot` only preserves ancestor/descendant relationships because it is used to assert that a given element _contains_ a certain structure. This compacted tree structure is created recursively for the entire DOM tree within the given DOM element.

## Installation

```
npm install data-tree-snapshot -D
```

## API

### `getTextTree` (Text Snapshotting, named export)

```js
import React from 'react'
import { render } from '@testing-library/react'
import { getTextTree } from 'data-tree-snapshot'

test('has correct textContent', () => {
  // This is just an example. Normally, the JSX output would be a result of rendering
  // your app or a subset of your app and taking actions to get it into a given state
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

  const tree = getTextTree(container)

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
import makeGetDataTree from '../make-get-data-tree'
// 👆The default export of data-tree-snapshot, used to create data tree getters

export default makeGetDataTree({
  propertyName: 'textContent',
  filter: t => typeof t === 'string' && t.length > 0,
})
```

### `getTestIdTree` (Test Id Tree Snapshotting, named export)

```js
import React from 'react'
import { render } from '@testing-library/react'
import { getTestIdTree } from 'data-tree-snapshot'

test('shows correct components for scenario', () => {
  render(
    // This is just an example. Normally, the JSX output would be a result of rendering
    // your app or a subset of your app and taking actions to get it into a given state
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

#### Note: You can change the test id attribute that is used by default by using `configure` (see below)

(Lots more good info about this helper [on the wiki page!](https://github.com/granmoe/data-tree-snapshot/wiki/getTestIdTree))

#### Implementation

```js
import makeGetDataTree from '../make-get-data-tree'
// 👆The default export of data-tree-snapshot, used to create data tree geters

// If you use an attribute, the default string selector will be for that attribute
// e.g. document.querySelector('[data-testid="your-test-id-name"]') will be used for getTestIdTree
export default makeGetDataTree({
  attributeName: 'data-testid',
  filter: t => typeof t === 'string' && t.length > 0,
})
```

### `makeGetDataTree`

This is a function that creates a custom getDataTree function based on the following options object, represented here as a TypeScript interface:

```ts
interface options {
  // formats the value
  // value is the attribute or property we've gotten from the element
  // based on attributeName or propertyName
  format?: (value) => boolean
  // Only values / elements for which this returns true will be included
  filter?: (value, element) => boolean
  attributeName?: string
  propertyName?: string
}
```

The only requirement is that either `attributeName` or `propertyName` are passed (but not both).

The type of the returned get function is as follows `elementOrString => string`, where `elementOrString` is either an HTML element or a string value to be used as a selector for the given `attributeName` (passing a string selector for property tree geters is currently unsupported).

For example, when calling `getTestIdTree('root')`, `document.querySelector('[data-testid="root"]')` will be called to get the root element for which to get the test id tree.

Full example:

```js
const getLabelTree = makeGetDataTree({
  attributeName: 'label',
  filter: l => typeof l === 'string' && l.length > 0,
})

getLabelTree('some-label-value') // document.querySelector(`[label="some-label-value"]`) will be called to get the root element
```

### `configure`

Configure a custom test id attribute to be used by `getTestIdTree` instead of `data-testid`.

```js
import React from 'react'
import { cleanup, render } from '@testing-library/react'
import getTestIdTree from '.'
import configure from '../configure'

test('Can use a custom data-testid attribute', () => {
  const TestComponent = () => {
    return (
      <div data-qa="root">
        <br data-qa="first-child" />
        <br data-qa="second-child" />
        <br data-qa="third-child" />
      </div>
    )
  }

  // This could live in your jest setup if you want it to apply to all tests
  configure({ testIdAttribute: 'data-qa' })

  render(<TestComponent />)

  const tree = getTestIdTree('root')
  expect(tree).toMatchInlineSnapshot(`
                        "
                        first-child
                        second-child
                        third-child
                        "
            `)
})
```

## Upcoming Features

- Include multiple pieces of data per element
- Configure selectors for property getters
