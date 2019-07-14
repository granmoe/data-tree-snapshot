import React from 'react'
import { cleanup, render } from '@testing-library/react'
import makeGetAttributeTree from '.'

afterEach(cleanup)

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
