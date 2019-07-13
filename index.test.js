import React from 'react'
import { cleanup, render } from '@testing-library/react'
import makeGetAttributeTree from '.'

afterEach(cleanup)

const DirectChildrenOnly = () => {
  return (
    <div data-foo="root">
      <br data-foo="first-child" />
      <br data-foo="second-child" />
      <br data-foo="third-child" />
    </div>
  )
}

const getFooTree = makeGetAttributeTree({ attributeName: 'data-foo' })

test('blah', () => {
  render(<DirectChildrenOnly />)
  const tree = getFooTree('root')

  expect(tree).toMatchInlineSnapshot(`
    "
    first-child
    second-child
    third-child
    "
  `)
})
