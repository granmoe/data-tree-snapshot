import React from 'react'
import { cleanup, render } from '@testing-library/react'
import getTestIdTree from '.'

afterEach(cleanup)

const DirectChildrenOnly = () => {
  return (
    <div data-testid="root">
      <br data-testid="first-child" />
      <br data-testid="second-child" />
      <br data-testid="third-child" />
    </div>
  )
}

test('Can pass a string of an existent test id', () => {
  render(<DirectChildrenOnly />)
  const tree = getTestIdTree('root')
  expect(tree).toMatchInlineSnapshot(`
                        "
                        first-child
                        second-child
                        third-child
                        "
            `)
})

test('Passing a string of non-existent test id throws', () => {
  render(<DirectChildrenOnly />)
  expect(() => {
    getTestIdTree('some crazy stuff')
  }).toThrow()
})

test('Can pass a DOM element', () => {
  const { container } = render(<DirectChildrenOnly />)
  const tree = getTestIdTree(container)
  expect(tree).toMatchInlineSnapshot(`
                    "
                    root
                      first-child
                      second-child
                      third-child
                    "
          `)
})

test('Passing a non-string that is not a DOM element throws', () => {
  expect(() => {
    getTestIdTree({})
  }).toThrow()
})

const emptyIntermediateLayersTestCases = [
  () => (
    <div data-testid="root">
      <br data-testid="first-child" />
      <div data-testid="second-child">
        <br data-testid="child-of-second-child" />
      </div>
      <br data-testid="third-child" />
    </div>
  ),
  () => (
    <div data-testid="root">
      <div>
        <br data-testid="first-child" />
      </div>
      <div data-testid="second-child">
        <br data-testid="child-of-second-child" />
      </div>
      <br data-testid="third-child" />
    </div>
  ),
  () => (
    <div data-testid="root">
      <div>
        <div>
          <br data-testid="first-child" />
        </div>
        <div data-testid="second-child">
          <br data-testid="child-of-second-child" />
        </div>
      </div>
      <br data-testid="third-child" />
    </div>
  ),
  () => (
    <div data-testid="root">
      <div>
        <div>
          <div>
            <br data-testid="first-child" />
          </div>
          <div data-testid="second-child">
            <br data-testid="child-of-second-child" />
          </div>
        </div>
      </div>
      <br data-testid="third-child" />
    </div>
  ),
  () => (
    <div data-testid="root">
      <div>
        <div>
          <div>
            <div>
              <div>
                <br data-testid="first-child" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-testid="second-child">
        <br data-testid="child-of-second-child" />
      </div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <br data-testid="third-child" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
]

emptyIntermediateLayersTestCases.forEach((Component, i) => {
  it(`collapses non-tagged intermediate layers, test case ${i}`, () => {
    const { container } = render(<Component />)
    expect(getTestIdTree(container)).toBe(`
root
  first-child
  second-child
    child-of-second-child
  third-child
`)
  })
})

test(`Treats test ids that aren't non-empty strings as empty intermediate layers`, () => {
  render(
    <div data-testid="root">
      <div data-testid="">
        <div data-testid={null}>
          <div data-testid={undefined}>
            <br data-testid="first-child" />
          </div>
        </div>
        <div data-testid={[]}>
          <div data-testid="second-child">
            <br data-testid="first-grandchild" />
          </div>
        </div>
      </div>
    </div>,
  )

  expect(getTestIdTree('root')).toMatchInlineSnapshot(`
        "
        first-child
        second-child
          first-grandchild
        "
    `)

  // NOTE: React casts certain things (including objects, sets, numbers, booleans)
  // To string when they are passed as the value of an HTML attribute
  // But there's probably no good reason to pass these as test ids anyway
})

// eslint-disable-next-line react/prop-types
const OnlyOneChild = ({ dataTestId = 'only-one-child', children }) => {
  return (
    <div data-testid={dataTestId}>
      <div data-testid="child">{children}</div>
    </div>
  )
}

test('only one child', () => {
  const { getByTestId } = render(<OnlyOneChild />)
  const tree = getTestIdTree(getByTestId('only-one-child'))
  expect(tree).toMatchInlineSnapshot(`
                        "
                        child
                        "
            `)
})

test('multiple single child layers', () => {
  render(
    <OnlyOneChild>
      <OnlyOneChild dataTestId="grandchild" />
    </OnlyOneChild>,
  )

  const tree = getTestIdTree('only-one-child')

  expect(tree).toMatchInlineSnapshot(`
                        "
                        child
                          grandchild
                            child
                        "
            `)
})

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
