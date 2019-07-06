import React from 'react'
import { exportAllDeclaration } from '@babel/types'

const foo = () => {
  return <div>asdf</div>
}

test('asdf', () => {
  expect(1).toBeTruthy()
})

// Import { render } from '@testing-library/react'
// import getTestIdTree from '.'

// test('siblings only', () => {
// const { getByTestId } = render()
// })
