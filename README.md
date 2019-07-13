# Get Test Id Tree 🌴

Create the smallest possible representation of what test ids are contained in a DOM element and within other test ids within that DOM element. `get-test-id-tree` only preserves ancestor/descendant relationships because it is used to assert that a given test id _contains_ another test id or test ids. This compacted tree structure is created recursively for the entire DOM tree within the given DOM element or data-testid string.

TODO: Background info justifying data-testids, links (@TL/R, KCD blog)

## Basic Example

This HTML:

```html
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
</div>
```

Will produce this elegantly formatted output:

```
parent
  child
    deeply-nested-child
  another-child
  yet-another-child
```

## Examples

More realistic examples to come...for now, check out the test cases in index.test.js 🙂

## Usage

```
npm install get-test-id-tree -D
```

```js
import React from 'react'
import { render } from '@testing-library/react'
import getTestIdTree from 'get-test-id-tree'

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

## Motivation

TODO: real world examples with tons of expect(element).toBeTruthy / toBeFalsy()

## Installation and Requirements

TODO: Explain assumption of Jest used with a simulated DOM env like the default jsdom
