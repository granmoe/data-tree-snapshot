TODO: Update this and link to get-test-id-tree
Adapt the GH description of GTIT to this

# Get Test Id Tree 🌴

## Who This Tool is For

This library assumes that you make heavy use of `data-testid` attributes for testing. The reason to use them is to [make your frontend and end-to-end tests resilient to change](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change). As a bonus, they may simultaneously be used as convenient handles for things like analytics. However, you should consider using [accessible or semantic queries in your tests if possible](https://testing-library.com/docs/guide-which-query). As with anything else, this library may or may not be right for your use case.

So what is the right use case? Test ids are a good fit for you if the nature of your app is such that the text on your site is volatile (changes constantly due to legal, requirements, marketing, etc) and/or highly dynamic (based on complex logic and/or data). It's extra useful if the structure of your app is similarly volatile and dynamic. In this situation, the accessible and semantic queries make your tests far too brittle.

[Discussion with Kent C. Dodds on data-testids vs other selectors](https://twitter.com/GraynMoog/status/1149869599825047552)

## Intro

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
