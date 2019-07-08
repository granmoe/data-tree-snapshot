import React from 'react'
import { cleanup, render } from '@testing-library/react'
import getTestIdTree from '.'

afterEach(cleanup)

const DirectChildrenOnly = () => {
  return (
    <div data-testid="direct-children-only">
      <br data-testid="first-child" />
      <br data-testid="second-child" />
      <br data-testid="three-child" />
    </div>
  )
}

test('direct children only', () => {
  const { getByTestId } = render(<DirectChildrenOnly />)
  const tree = getTestIdTree(getByTestId('direct-children-only'))
  expect(tree).toMatchInlineSnapshot(`
                                            "
                                              first-child
                                              second-child
                                              three-child
                                            "
                      `)
})

test('direct children and one parent', () => {
  const { container } = render(<DirectChildrenOnly />)
  const tree = getTestIdTree(container)
  expect(tree).toMatchInlineSnapshot(`
    "
      direct-children-only: 
        first-child
        second-child
        three-child
    "
  `)
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
  expect(tree).toMatchInlineSnapshot(`"child"`)
})

// TODO: Term...levels, layers, generations, branches
test('multiple single child layers', () => {
  const { getByTestId } = render(
    <OnlyOneChild>
      <OnlyOneChild dataTestId="grandchild" />
    </OnlyOneChild>,
  )

  const tree = getTestIdTree(getByTestId('only-one-child'))

  // TODO: Better way to represent this?
  expect(tree).toMatchInlineSnapshot(`
    "
      child: 
        grandchild: child
    "
  `)
})

// TODO: If this is used for examples also, find more realistic names for data-testids
// Might make testing harder to reason about, though...so prob have separate examples

// TODO: Enumerate all possible structures in tree
test('scratchpad', () => {
  const { container } = render(
    <OnlyOneChild>
      <OnlyOneChild dataTestId="grandchild" />
      <DirectChildrenOnly />
      <OnlyOneChild>
        <DirectChildrenOnly />
      </OnlyOneChild>
    </OnlyOneChild>,
  )

  const tree = getTestIdTree(container)

  expect(tree).toMatchInlineSnapshot(`
    "
      only-one-child: 
        child: 
            grandchild: child
            direct-children-only: 
              first-child
              second-child
              three-child
            only-one-child: 
              child: 
                direct-children-only: 
                  first-child
                  second-child
                  three-child
    "
  `)
})
