import { StrictMode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import App from './App'

let callbacks
let id
beforeEach(() => {
  callbacks = new Map(); id = 0
  vi.stubGlobal('requestAnimationFrame', (callback) => { callbacks.set(++id, callback); return id })
  vi.stubGlobal('cancelAnimationFrame', (key) => callbacks.delete(key))
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
})
afterEach(() => vi.unstubAllGlobals())
const click = (name) => fireEvent.click(screen.getByRole('button', { name, exact: true }))
const stat = (name) => screen.getByText(name, { selector: 'dt' }).nextElementSibling.textContent

it('connects editing, run locks, pause/step/resume, stop, clear and reset in StrictMode', () => {
  render(<StrictMode><App /></StrictMode>)
  click('Row 1, column 1: empty')
  expect(screen.getByRole('button', { name: 'Row 1, column 1: wall' })).toBeEnabled()
  click('Run')
  expect(screen.getByRole('status')).toHaveTextContent('Searching')
  expect(screen.getByRole('button', { name: 'Run', exact: true })).toBeDisabled()
  expect(screen.getByLabelText('Select drawing tool')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Row 1, column 1: wall' })).toBeDisabled()
  click('Pause')
  expect(screen.getByRole('status')).toHaveTextContent('Paused')
  click('Step')
  expect(stat('Visited')).toBe('1')
  expect(stat('Cost')).toBe('—')
  expect(screen.getByRole('button', { name: 'Row 8, column 6: start, visited' })).toHaveClass('cell-start')
  click('Resume')
  click('Stop')
  expect(screen.getByRole('status')).toHaveTextContent('Stopped')
  expect(stat('Visited')).toBe('1')
  click('Clear search')
  expect(stat('Visited')).toBe('0')
  expect(screen.getByRole('button', { name: 'Row 1, column 1: wall' })).toBeEnabled()
  click('Run')
  const stale = [...callbacks.values()][0]
  click('Reset board')
  act(() => stale(performance.now() + 10000))
  expect(screen.getByRole('status')).toHaveTextContent('Ready')
  expect(screen.getByRole('button', { name: 'Row 1, column 1: empty' })).toBeEnabled()
  expect(callbacks.size).toBe(0)
})

it('renders reduced-motion results immediately and clears stale results after edits', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  render(<App />)
  fireEvent.change(screen.getByLabelText('Select drawing tool'), { target: { value: 'weight' } })
  click('Row 8, column 7: empty')
  click('Run')
  expect(screen.getByRole('status')).toHaveTextContent('Complete')
  expect(stat('Path length')).toBe('14')
  expect(stat('Cost')).toBe('18')
  expect(screen.getByRole('button', { name: 'Row 8, column 7: weight, path' })).toHaveClass('cell-path')
  expect(screen.getByRole('button', { name: 'Row 8, column 20: target, path' })).toHaveClass('cell-target')
  expect(callbacks.size).toBe(0)
  click('Clear search')
  expect(screen.getByRole('button', { name: 'Row 8, column 7: weight' })).toHaveClass('cell-weight')
  click('Run')
  click('Row 1, column 1: empty, visited')
  expect(screen.getByRole('status')).toHaveTextContent('Ready')
  expect(stat('Cost')).toBe('—')
})
