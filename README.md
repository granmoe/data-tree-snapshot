# Get Test Id Tree 🌴

(This library assumes that you use `data-testid` attributes for testing. The reason to use them is to [make your frontend and end-to-end tests resilient to change](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change) (and they may simultaneously be used as convenient handles for things like analytics). As with anything else, they may or may not be right for your use case.)

Create the smallest possible representation of what test ids are contained in a DOM element and within other test ids within that DOM element. `get-test-id-tree` only preserves ancestor/descendant relationships because it is used to assert that a given test id _contains_ another test id or test ids. This compacted tree structure is created recursively for the entire DOM tree within the given DOM element or data-testid string.

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

Will produce this concise, neatly formatted output:

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

## Motivation

If you use data-testids a lot for testing (and possibly other things, like analytics), and your app has a high volume of complex conditional rendering across various scenarios based on multitudinous factors like feature flags, types of client / user, and responsive designs, in addition to your standard UI logic, then you may have tests that look like this:

```js
expect(getByTestId('section-a')).toBeTruthy()
expect(getByTestId('section-b')).toBeTruthy()
expect(getByTestId('section-c')).toBeFalsy()
expect(getByTestId('section-d')).toBeTruthy()

expect(getByTestId('widget-1')).toBeTruthy()
expect(getByTestId('something-inside-widget-1')).toBeTruthy()
expect(getByTestId('something-that-should-not-be-there')).toBeFalsy()
expect(getByTestId('this-should-not-be-there-either')).toBeFalsy()

expect(getByTestId('foo-a')).toBeFalsy()
expect(getByTestId('foo-b')).toBeTruthy()

expect(getByTestId('bar')).toBeTruthy()
expect(getByTestId('baz')).toBeFalsy()
expect(getByTestId('quux')).toBeTruthy()
```

`get-test-id-tree` turns that into this:

```js
// You can always use a normal, separate snapshot via toMatchSnapshot also
expect(getTestIdTree('wrapper')).toMatchInlineSnapshot(`
"
section-a
section-b
section-d
widget-1
  something-inside-widget-1
foo-b
bar
quux
"
`)
```
