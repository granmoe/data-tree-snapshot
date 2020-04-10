import React from 'react'
import { cleanup, render } from '@testing-library/react'
import makeGetDataTree from './make-get-data-tree'

afterEach(cleanup)

// TODO: Test handled errors

test('filtering by both value and element', () => {
  const { container } = render(
    <section>
      <div>
        <p>Paragraph 1</p>
        <p>
          Paragraph <span>2</span>
        </p>
        <p data-ignore>Paragraph 3</p>
      </div>
    </section>,
  )

  const getTagNameTree = makeGetDataTree({
    propertyName: 'tagName',
    filter: (value, element) =>
      typeof value === 'string' &&
      value.length > 0 &&
      !element.getAttribute('data-ignore'),
  })

  const tree = getTagNameTree(container)

  expect(tree).toMatchInlineSnapshot(`
    "
    SECTION
      DIV
        P
        P
          SPAN
    "
  `)
})

test('data attribute', () => {
  render(
    <div data-foo="root">
      <br data-foo="first-child" />
      <br data-foo="second-child" />
      <br data-foo="third-child" />
    </div>,
  )

  const getFooTree = makeGetDataTree({ attributeName: 'data-foo' })
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

  const getLabelTree = makeGetDataTree({
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
