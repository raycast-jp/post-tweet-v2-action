/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main.js'
import { vi } from 'vitest'

// Mock the action's entrypoint
const runMock = vi
  .spyOn(main, 'run')
  .mockImplementation(async () => Promise.resolve())

describe('index', () => {
  it('calls run when imported', async () => {
    // Dynamic import for ESM
    await import('../src/index.js')

    expect(runMock).toHaveBeenCalled()
  })
})
