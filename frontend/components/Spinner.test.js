// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true)
})

describe('testing spinner', () => {
  test('Spinner on test', () => {
    render(<Spinner on={true}/>)

    const test = screen.getByText('Please wait...');
    
    expect(test).toBeTruthy();
  })

  test('Spinner off test', () => {
    render(<Spinner on={false}/>)

    const test = screen.queryByText('Please wait...');
    
    expect(test).not.toBeTruthy();
  })
})
