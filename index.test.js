import React from 'react'
import { cleanup, render } from '@testing-library/react'
import makeGetAttributeTree from '.'

afterEach(cleanup)

// TODO: Test handled errors (prob move coverage from get-test-id-tree into here, too)

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

test('textContent', () => {
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

  const tree = getTextContentTree(container) // TODO: Allow passing in a root selector func

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
