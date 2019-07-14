import React from 'react'
import { cleanup, render } from '@testing-library/react'
import makeGetAttributeTree from './make-print-data-tree'

afterEach(cleanup)

// TODO: Test handled errors

test('data attribute', () => {
  render(
    <div data-foo="root">
      <br data-foo="first-child" />
      <br data-foo="second-child" />
      <br data-foo="third-child" />
    </div>,
  )

  const getFooTree = makeGetAttributeTree({ attributeName: 'data-foo' })
  const tree = getFooTree('root')

  expect(tree).toMatchInlineSnapshot(`
                        "
                        first-child
                        second-child
                        third-child
                        "
            `)
})

test('label', () => {
  const { container } = render(
    <div label="root">
      <div>
        <div label="parent">
          <div label="child">
            <div>
              <div>
                <span label="deeply-nested-child">some stuff</span>
              </div>
            </div>
          </div>
          <br label="another-child" />
          <div>
            <br label="yet-another-child" />
          </div>
        </div>
      </div>
    </div>,
  )

  const getLabelTree = makeGetAttributeTree({
    attributeName: 'label',
    filter: l => typeof l === 'string' && l.length > 0,
  })

  const tree = getLabelTree(container)

  expect(tree).toMatchInlineSnapshot(`
            "
            root
              parent
                child
                  deeply-nested-child
                another-child
                yet-another-child
            "
      `)
})
