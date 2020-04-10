import React from 'react'
import { cleanup, render } from '@testing-library/react'
import configure from '../configure'
import getTestIdTree from '.'

afterEach(cleanup)

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
