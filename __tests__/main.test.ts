/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { vi } from 'vitest'
import { type TweetV2PostTweetResult } from 'twitter-api-v2'

vi.mock('@actions/core')
vi.mock('../src/x.js')

const core = await import('@actions/core')
const XAPI = await import('../src/x.js')
const main = await import('../src/main.js')

describe('action', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(core.getInput).mockReturnValue('')
    vi.mocked(XAPI.X).mockReturnValue(
      async (message: string) =>
        ({ data: { id: '123', text: message } }) as TweetV2PostTweetResult
    )
  })

  it('sets the time output', async () => {
    vi.mocked(core.getInput).mockImplementation(message => {
      switch (message) {
        case 'message':
          return 'whoa!!'
        default:
          return ''
      }
    })

    await main.run()

    expect(XAPI.X).toHaveBeenCalledWith({
      accessSecret: '',
      accessToken: '',
      appKey: '',
      appSecret: ''
    })

    expect(core.error).not.toHaveBeenCalled()
  })
})
